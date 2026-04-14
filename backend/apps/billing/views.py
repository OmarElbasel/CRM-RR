import logging

import stripe
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.billing.constants import PLAN_LIMITS, STRIPE_EVENT_CACHE_KEY, STRIPE_EVENT_CACHE_TTL
from apps.billing.serializers import CreateCheckoutSerializer
from apps.core.flags import is_enabled


class CreateCheckoutView(APIView):
    """
    POST /api/billing/create-checkout/
    Creates a Stripe-hosted Checkout session for plan upgrade.
    Requires Clerk JWT authentication (Constitution Principle I).
    Gated on FLAG_BILLING (Constitution Principle IV).
    """

    @extend_schema(
        summary='Create Stripe Checkout session',
        description=(
            'Creates a Stripe-hosted Checkout session for plan upgrade. '
            'Returns the checkout URL. Redirect the merchant to this URL. '
            'Gated on FLAG_BILLING feature flag.'
        ),
        request=CreateCheckoutSerializer,
        responses={
            200: inline_serializer(
                name='CheckoutResponse',
                fields={
                    'checkout_url': serializers.URLField(),
                    'session_id': serializers.CharField(),
                },
            ),
            400: inline_serializer(
                name='CheckoutError',
                fields={
                    'error': serializers.CharField(),
                    'error_ar': serializers.CharField(),
                },
            ),
        },
        tags=['Billing'],
    )
    def post(self, request):
        if not is_enabled('BILLING'):
            return Response(
                {
                    'error': 'Billing is not enabled.',
                    'error_ar': 'الفوترة غير مفعّلة.',
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        ser = CreateCheckoutSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        plan = ser.validated_data['plan']
        org = request.org

        if org.plan == plan:
            return Response(
                {
                    'error': f'Organization is already on the {plan} plan.',
                    'error_ar': f'المنظمة بالفعل على خطة {plan}.',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        stripe.api_key = settings.STRIPE_SECRET_KEY

        price_map = {
            'starter': settings.STRIPE_PRICE_STARTER,
            'pro': settings.STRIPE_PRICE_PRO,
        }
        price_id = price_map.get(plan)
        if not price_id:
            return Response(
                {
                    'error': 'Enterprise upgrades require contacting sales.',
                    'error_ar': 'ترقيات Enterprise تتطلب التواصل مع فريق المبيعات.',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create or reuse Stripe customer
        if not org.stripe_customer_id:
            customer = stripe.Customer.create(
                name=org.name,
                metadata={'clerk_org_id': org.clerk_org_id, 'org_db_id': str(org.pk)},
            )
            org.stripe_customer_id = customer.id
            org.save(update_fields=['stripe_customer_id'])

        success_url = ser.validated_data.get('success_url') or f'{settings.FRONTEND_URL}/dashboard?upgraded=1'
        cancel_url = ser.validated_data.get('cancel_url') or f'{settings.FRONTEND_URL}/dashboard'

        session = stripe.checkout.Session.create(
            customer=org.stripe_customer_id,
            mode='subscription',
            line_items=[{'price': price_id, 'quantity': 1}],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={'clerk_org_id': org.clerk_org_id, 'target_plan': plan},
        )

        return Response({'checkout_url': session.url, 'session_id': session.id})


class StripeWebhookView(APIView):
    """
    POST /api/billing/webhook/
    Receives Stripe webhook events.
    Authentication: Stripe HMAC signature (NOT Clerk JWT).
    Idempotent: duplicate event IDs return 200 without re-processing.
    """

    authentication_classes = []  # Stripe sig is the auth — no Clerk JWT
    permission_classes = []

    @extend_schema(
        summary='Stripe webhook receiver',
        description=(
            'Receives Stripe events. Verifies HMAC signature. Idempotent on duplicate event IDs. '
            'Supported: checkout.session.completed, customer.subscription.updated, '
            'customer.subscription.deleted.'
        ),
        responses={
            200: inline_serializer(
                name='WebhookResponse',
                fields={'status': serializers.CharField()},
            ),
            400: inline_serializer(
                name='WebhookError',
                fields={
                    'error': serializers.CharField(),
                    'error_ar': serializers.CharField(),
                },
            ),
        },
        tags=['Billing'],
    )
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response(
                {
                    'error': 'Invalid Stripe signature.',
                    'error_ar': 'توقيع Stripe غير صالح.',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Idempotency check (Constitution — webhook idempotency requirement)
        cache_key = STRIPE_EVENT_CACHE_KEY.format(event_id=event['id'])
        if cache.get(cache_key):
            return Response({'status': 'already_handled'})

        # Process supported event types
        event_type = event['type']
        if event_type == 'checkout.session.completed':
            self._handle_checkout_completed(event['data']['object'])
        elif event_type == 'customer.subscription.updated':
            self._handle_subscription_updated(event['data']['object'])
        elif event_type == 'customer.subscription.deleted':
            self._handle_subscription_deleted(event['data']['object'])
        else:
            # Mark unsupported events as handled to prevent retry loops
            logger.info('Ignoring unsupported Stripe event type: %s', event_type)
            cache.set(cache_key, True, STRIPE_EVENT_CACHE_TTL)
            return Response({'status': 'ignored'})

        # Mark as processed
        cache.set(cache_key, True, STRIPE_EVENT_CACHE_TTL)
        return Response({'status': 'processed'})

    def _handle_checkout_completed(self, session):
        from apps.orgs.models import Organization

        customer_id = session.get('customer')
        target_plan = session.get('metadata', {}).get('target_plan')
        subscription_id = session.get('subscription')
        if not customer_id or not target_plan:
            return

        limit = PLAN_LIMITS.get(target_plan)
        db_limit = limit if limit is not None else 999999

        Organization.objects.filter(stripe_customer_id=customer_id).update(
            plan=target_plan,
            monthly_generation_limit=db_limit,
            stripe_subscription_id=subscription_id or '',
        )

        org = Organization.objects.filter(stripe_customer_id=customer_id).first()
        if org:
            try:
                from apps.core.analytics import capture
                capture('plan_upgraded', org, {'new_plan': target_plan})
            except Exception:
                pass
            try:
                from apps.billing.tasks import send_plan_upgrade_confirmation
                send_plan_upgrade_confirmation.delay(org.pk, target_plan)
            except Exception:
                pass

    def _handle_subscription_updated(self, subscription):
        """Sync plan on renewal or manual upgrade/downgrade via Stripe Dashboard."""
        from apps.orgs.models import Organization

        customer_id = subscription.get('customer')
        stripe_status = subscription.get('status')
        if not customer_id or stripe_status not in ('active', 'trialing'):
            return

        # Resolve plan from the subscription's price metadata
        # Price IDs are mapped to plan names via settings
        price_id = None
        items = subscription.get('items', {}).get('data', [])
        if items:
            price_id = items[0].get('price', {}).get('id')

        plan_by_price = {
            settings.STRIPE_PRICE_STARTER: 'starter',
            settings.STRIPE_PRICE_PRO: 'pro',
        }
        plan = plan_by_price.get(price_id)
        if not plan:
            return

        limit = PLAN_LIMITS[plan]
        Organization.objects.filter(stripe_customer_id=customer_id).update(
            plan=plan,
            monthly_generation_limit=limit,
            stripe_subscription_id=subscription['id'],
        )

    def _handle_subscription_deleted(self, subscription):
        """Revert org to free plan when subscription is cancelled."""
        from apps.orgs.models import Organization

        customer_id = subscription.get('customer')
        if not customer_id:
            return

        Organization.objects.filter(stripe_customer_id=customer_id).update(
            plan='free',
            monthly_generation_limit=PLAN_LIMITS['free'],
            stripe_subscription_id='',
        )
