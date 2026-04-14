import csv
import hashlib
import hmac as hmac_lib
import logging
import secrets
from datetime import datetime
from urllib.parse import urlencode

from cryptography.fernet import Fernet
from django.conf import settings
from django.core.cache import cache
from django.db.models import Count, Sum
from django.http import StreamingHttpResponse
from django.shortcuts import redirect
from django.utils import timezone as dj_tz
from drf_spectacular.utils import extend_schema
from rest_framework import status as drf_status
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.flags import require_flag
from .models import Order, ShopifyIntegration
from .serializers import OrderSerializer, OrderUpdateSerializer, ManualOrderCreateSerializer

logger = logging.getLogger(__name__)

SHOPIFY_SCOPES = 'read_orders,write_orders,read_customers,read_checkouts'


# ── Helpers ───────────────────────────────────────────────────────────────────

def _bilingual_error(status_code: int, detail_en: str, detail_ar: str, code: str):
    """Return a DRF Response with bilingual error body (Constitution III)."""
    return Response(
        {'detail': detail_en, 'detail_ar': detail_ar, 'code': code},
        status=status_code,
    )


# ── OAuth views ───────────────────────────────────────────────────────────────

class ShopifyInstallView(APIView):
    """
    GET /api/shopify/install/?shop=mystore.myshopify.com
    Initiates Shopify OAuth install flow. Requires Clerk JWT auth.
    Constitution I: request.org scopes the install.
    Constitution IV: gated on FLAG_SHOPIFY_ORDER_HUB.
    """

    @extend_schema(
        summary='Initiate Shopify OAuth install',
        tags=['Shopify & Orders'],
        parameters=[{'name': 'shop', 'in': 'query', 'required': True, 'schema': {'type': 'string'}}],
        responses={302: None, 400: None},
    )
    @require_flag('SHOPIFY_ORDER_HUB')
    def get(self, request: Request):
        shop = request.query_params.get('shop', '').strip().lower()
        if not shop or '.myshopify.com' not in shop:
            return _bilingual_error(400, 'Invalid shop domain', 'نطاق المتجر غير صالح', 'invalid_shop')

        # Check if shop is already connected to a different org
        existing = ShopifyIntegration.objects.filter(shop_domain=shop).exclude(org=request.org).first()
        if existing:
            return _bilingual_error(
                409, 'Shop already connected to another account',
                'المتجر مرتبط بحساب آخر', 'shop_already_connected',
            )

        nonce = secrets.token_urlsafe(32)
        cache.set(f'shopify_nonce:{request.org.pk}', nonce, timeout=600)
        # Store nonce → org_id mapping so callback can look up the org
        cache.set(f'shopify_nonce_state:{nonce}', request.org.pk, timeout=600)

        params = {
            'client_id': settings.SHOPIFY_CLIENT_ID,
            'scope': SHOPIFY_SCOPES,
            'redirect_uri': f'{settings.BACKEND_BASE_URL}/api/shopify/callback/',
            'state': nonce,
        }
        oauth_url = f'https://{shop}/admin/oauth/authorize?{urlencode(params)}'
        return redirect(oauth_url)


class ShopifyCallbackView(APIView):
    """
    GET /api/shopify/callback/
    Called by Shopify after merchant approves. Verifies HMAC + nonce.
    Stores Fernet-encrypted token. Registers webhooks. Enqueues initial sync.
    Constitution I: org from JWT — scoped.
    Constitution IV: gated on FLAG_SHOPIFY_ORDER_HUB.
    """
    authentication_classes = []  # Shopify callback has no Clerk JWT — skip auth
    permission_classes = []

    @extend_schema(exclude=True)
    @require_flag('SHOPIFY_ORDER_HUB')
    def get(self, request: Request):
        params = request.query_params
        shop = params.get('shop', '')
        code = params.get('code', '')
        state = params.get('state', '')
        received_hmac = params.get('hmac', '')

        # Verify HMAC over query params (excluding hmac itself)
        sorted_params = '&'.join(
            f'{k}={v}' for k, v in sorted(params.items()) if k != 'hmac'
        )
        computed = hmac_lib.new(
            settings.SHOPIFY_CLIENT_SECRET.encode(),
            sorted_params.encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac_lib.compare_digest(computed, received_hmac):
            logger.warning('ShopifyCallbackView: HMAC mismatch for shop=%s', shop)
            return _bilingual_error(400, 'Invalid OAuth signature', 'توقيع غير صالح', 'hmac_invalid')

        # Validate nonce — look up org from state→org_id cache
        org_id = cache.get(f'shopify_nonce_state:{state}')
        if not org_id:
            return _bilingual_error(400, 'State mismatch or expired', 'الجلسة منتهية', 'state_invalid')

        from apps.orgs.models import Organization
        try:
            org = Organization.objects.get(pk=org_id)
        except Organization.DoesNotExist:
            return _bilingual_error(400, 'Organization not found', 'المنظمة غير موجودة', 'org_not_found')

        # Exchange code for permanent access token
        from apps.shopify.services.shopify import ShopifyClient, ShopifyClientError  # noqa: F401
        try:
            client_temp = ShopifyClient(shop, '')
            access_token = client_temp.exchange_access_token(code)
        except Exception as exc:
            logger.error('ShopifyCallbackView: token exchange failed for shop=%s: %s', shop, exc)
            return _bilingual_error(400, 'Token exchange failed', 'فشل تبادل الرمز', 'token_exchange_failed')

        # Encrypt token
        fernet = Fernet(settings.FERNET_KEY)
        encrypted_token = fernet.encrypt(access_token.encode())

        # Upsert ShopifyIntegration
        integration, _ = ShopifyIntegration.objects.update_or_create(
            org=org,
            defaults={
                'shop_domain': shop,
                'access_token': encrypted_token,
                'is_active': True,
            },
        )

        # Register webhooks
        try:
            client = ShopifyClient(shop, access_token)
            client.register_webhooks(settings.BACKEND_BASE_URL)
        except Exception as exc:
            logger.warning('ShopifyCallbackView: webhook registration failed for shop=%s: %s', shop, exc)

        # Enqueue initial 30-day sync
        from apps.shopify.tasks import sync_shopify_orders_initial
        sync_shopify_orders_initial.apply_async(args=[integration.pk])

        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        return redirect(f'{frontend_url}/orders?connected=true')


# ── Order CRUD views ──────────────────────────────────────────────────────────

class OrderPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class OrderListView(APIView):
    """
    GET /api/orders/
    List all orders for the authenticated org. Filterable by source, status, date range.
    Constitution I: all queries scoped to request.org.
    """

    @extend_schema(
        summary='List orders',
        tags=['Shopify & Orders'],
        parameters=[
            {'name': 'source', 'in': 'query', 'schema': {'type': 'string', 'enum': ['SHOPIFY', 'WHATSAPP', 'MANUAL']}},
            {'name': 'status', 'in': 'query', 'schema': {'type': 'string'}},
            {'name': 'date_from', 'in': 'query', 'schema': {'type': 'string', 'format': 'date'}},
            {'name': 'date_to', 'in': 'query', 'schema': {'type': 'string', 'format': 'date'}},
        ],
        responses={200: OrderSerializer(many=True)},
    )
    @require_flag('SHOPIFY_ORDER_HUB')
    def get(self, request: Request):
        qs = Order.objects.filter(org=request.org).order_by('-created_at')
        source = request.query_params.get('source')
        status_filter = request.query_params.get('status')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        if source:
            qs = qs.filter(source=source)
        if status_filter:
            qs = qs.filter(status=status_filter)
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)

        paginator = OrderPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = OrderSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class OrderDetailView(APIView):
    """
    GET /api/orders/<id>/ — retrieve single order
    PATCH /api/orders/<id>/ — update status or notes
    Constitution I: 404 if order does not belong to request.org.
    """

    def _get_order(self, pk: int, org):
        try:
            return Order.objects.get(pk=pk, org=org)
        except Order.DoesNotExist:
            return None

    @extend_schema(summary='Get order detail', tags=['Shopify & Orders'], responses={200: OrderSerializer})
    @require_flag('SHOPIFY_ORDER_HUB')
    def get(self, request: Request, pk: int):
        order = self._get_order(pk, request.org)
        if not order:
            return _bilingual_error(404, 'Order not found', 'الطلب غير موجود', 'not_found')
        return Response(OrderSerializer(order).data)

    @extend_schema(
        summary='Update order', tags=['Shopify & Orders'],
        request=OrderUpdateSerializer, responses={200: OrderSerializer},
    )
    @require_flag('SHOPIFY_ORDER_HUB')
    def patch(self, request: Request, pk: int):
        order = self._get_order(pk, request.org)
        if not order:
            return _bilingual_error(404, 'Order not found', 'الطلب غير موجود', 'not_found')
        serializer = OrderUpdateSerializer(order, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        # Trigger deal stage sync on status change (Constitution I — scoped to org)
        from apps.shopify.services.attribution import DEAL_STAGE_MAP
        new_stage = DEAL_STAGE_MAP.get(order.status)
        if new_stage and order.contact_id:
            from apps.pipeline.models import Deal
            Deal.objects.filter(org=request.org, contact_id=order.contact_id).exclude(
                stage__in=['PAID', 'LOST']
            ).update(stage=new_stage)
        return Response(OrderSerializer(order).data)


class ShopifyWebhookView(APIView):
    """
    POST /api/webhooks/shopify/
    Receives Shopify webhook events. Verifies HMAC-SHA256. No Clerk JWT.
    Dispatches by X-Shopify-Topic header.
    Always returns HTTP 200 immediately (Shopify retries on non-200).
    Constitution I: looks up integration by shop_domain — scoped to that org.
    Constitution IV: gated on FLAG_SHOPIFY_ORDER_HUB.
    """
    authentication_classes = []
    permission_classes = []

    @extend_schema(exclude=True)
    @require_flag('SHOPIFY_ORDER_HUB')
    def post(self, request: Request):
        body = request.body
        hmac_header = request.META.get('HTTP_X_SHOPIFY_HMAC_SHA256', '')
        shop_domain = request.META.get('HTTP_X_SHOPIFY_SHOP_DOMAIN', '')
        topic = request.META.get('HTTP_X_SHOPIFY_TOPIC', '')

        from apps.shopify.services.shopify import ShopifyClient
        if not ShopifyClient.verify_webhook_hmac(body, hmac_header):
            logger.warning('ShopifyWebhookView: HMAC mismatch for shop=%s topic=%s', shop_domain, topic)
            return Response({'detail': 'Invalid signature'}, status=401)

        from apps.shopify.models import AbandonedCart
        try:
            integration = ShopifyIntegration.objects.get(shop_domain=shop_domain, is_active=True)
        except ShopifyIntegration.DoesNotExist:
            logger.warning('ShopifyWebhookView: no active integration for shop=%s', shop_domain)
            return Response({}, status=200)

        import json as _json
        try:
            payload = _json.loads(body)
        except ValueError:
            return Response({}, status=200)

        if topic in ('orders/create', 'orders/updated'):
            from apps.shopify.tasks import sync_shopify_order
            sync_shopify_order.apply_async(args=[integration.pk, payload])

        elif topic == 'carts/create':
            cart_token = payload.get('token', '')
            if cart_token:
                cart, created = AbandonedCart.objects.get_or_create(
                    shopify_cart_token=cart_token,
                    defaults={
                        'org': integration.org,
                        'integration': integration,
                        'customer_email': payload.get('email') or None,
                        'customer_phone': None,
                        'line_items': [
                            {
                                'title': li.get('title', ''),
                                'quantity': li.get('quantity', 1),
                                'price': li.get('price', '0'),
                            }
                            for li in payload.get('line_items', [])
                        ],
                        'total_amount': payload.get('total_price') or None,
                        'currency': payload.get('currency', 'QAR'),
                        'checkout_url': payload.get('checkout_url', ''),
                    },
                )
                if created:
                    from apps.shopify.tasks import send_cart_recovery
                    send_cart_recovery.apply_async(args=[cart.pk], countdown=3600)

        return Response({}, status=200)


class ManualOrderCreateView(APIView):
    """
    POST /api/orders/manual/
    Create a manual order from a WhatsApp conversation.
    Constitution I: order is scoped to request.org.
    """

    @extend_schema(
        summary='Create manual order',
        tags=['Shopify & Orders'],
        request=ManualOrderCreateSerializer,
        responses={201: OrderSerializer, 400: None},
    )
    @require_flag('SHOPIFY_ORDER_HUB')
    def post(self, request: Request):
        serializer = ManualOrderCreateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(
                {'detail': 'Validation failed', 'detail_ar': 'فشل التحقق', 'errors': serializer.errors},
                status=400,
            )
        d = serializer.validated_data
        order = Order.objects.create(
            org=request.org,
            source='MANUAL',
            status='PENDING',
            contact_id=d.get('contact_id'),
            line_items=d.get('line_items', []),
            total_amount=d['total_amount'],
            currency=d.get('currency', 'QAR'),
            notes=d.get('notes', ''),
        )
        try:
            from apps.core.analytics import capture
            capture('order_synced', request.org, {
                'order_id': str(order.id),
                'source': 'MANUAL',
            })
        except Exception:
            pass
        # Attribution — update total_spend if contact linked
        if order.contact_id:
            from apps.shopify.services.attribution import link_order_to_contact
            link_order_to_contact(order)
        return Response(OrderSerializer(order).data, status=201)


# ── Revenue summary view ──────────────────────────────────────────────────────

class OrderRevenueSummaryView(APIView):
    """
    GET /api/orders/summary/?month=2026-04
    Returns monthly revenue totals broken down by order source.
    Constitution I: scoped to request.org.
    """

    @extend_schema(summary='Monthly revenue summary', tags=['Shopify & Orders'])
    @require_flag('SHOPIFY_ORDER_HUB')
    def get(self, request: Request):
        month_str = request.query_params.get('month')
        if month_str:
            try:
                year, mon = map(int, month_str.split('-'))
            except (ValueError, TypeError):
                return _bilingual_error(
                    400, 'Invalid month format. Use YYYY-MM.',
                    'صيغة الشهر غير صحيحة', 'invalid_month',
                )
        else:
            now = dj_tz.now()
            year, mon = now.year, now.month

        qs = Order.objects.filter(
            org=request.org,
            created_at__year=year,
            created_at__month=mon,
        )
        total = qs.aggregate(total=Sum('total_amount'))['total'] or 0
        by_source = {}
        for source_val in ['SHOPIFY', 'WHATSAPP', 'MANUAL']:
            agg = qs.filter(source=source_val).aggregate(
                count=Count('id'), amount=Sum('total_amount')
            )
            by_source[source_val] = {
                'count': agg['count'] or 0,
                'amount': str(agg['amount'] or '0.00'),
            }
        return Response({
            'month': f'{year:04d}-{mon:02d}',
            'total_amount': str(total),
            'currency': 'QAR',
            'by_source': by_source,
        })


# ── CSV export view ───────────────────────────────────────────────────────────

class Echo:
    def write(self, value):
        return value


class OrderCsvExportView(APIView):
    """
    GET /api/orders/export/
    Streaming CSV download of filtered orders.
    Constitution I: scoped to request.org.
    """

    @extend_schema(summary='Export orders as CSV', tags=['Shopify & Orders'])
    @require_flag('SHOPIFY_ORDER_HUB')
    def get(self, request: Request):
        qs = Order.objects.filter(org=request.org).order_by('-created_at')
        source = request.query_params.get('source')
        status_f = request.query_params.get('status')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if source:
            qs = qs.filter(source=source)
        if status_f:
            qs = qs.filter(status=status_f)
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)

        def row_gen():
            pseudo_buffer = Echo()
            writer = csv.writer(pseudo_buffer)
            yield writer.writerow([
                'id', 'source', 'status', 'customer_name',
                'customer_email', 'total_amount', 'currency', 'created_at',
            ])
            for order in qs.iterator(chunk_size=100):
                yield writer.writerow([
                    order.pk, order.source, order.status, order.customer_name,
                    order.customer_email or '', order.total_amount, order.currency,
                    order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                ])

        from django.utils.timezone import now
        filename = f'rawaj-orders-{now().strftime("%Y-%m-%d")}.csv'
        response = StreamingHttpResponse(row_gen(), content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
