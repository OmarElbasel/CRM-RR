"""
Organization views.
All views here require authentication (ClerkJWTAuthentication sets request.org).
"""
from datetime import date

from django.db.models import Sum
from django.utils import timezone
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.billing.constants import PLAN_LIMITS, CURRENCY_RATES
from apps.billing.key_utils import generate_key_pair
from apps.core.flags import is_enabled
from apps.generate.models import AIUsage


@extend_schema(
    summary='Get current organization',
    description='Returns the authenticated organization. Requires a valid Clerk JWT with org_id claim.',
    responses={
        200: inline_serializer(
            name='OrgMeResponse',
            fields={
                'id': serializers.IntegerField(),
                'name': serializers.CharField(),
                'plan': serializers.CharField(),
                'clerk_org_id': serializers.CharField(),
            },
        ),
        401: inline_serializer(
            name='UnauthorizedResponse',
            fields={
                'error': serializers.CharField(),
                'error_ar': serializers.CharField(),
            },
        ),
    },
    tags=['Organizations'],
)
@api_view(['GET'])
def org_me(request):
    """
    Return the current authenticated organization.
    request.org is set by ClerkJWTAuthentication.
    This endpoint is the canonical "am I authenticated?" check.
    """
    org = request.org
    return Response({
        'id': org.id,
        'name': org.name,
        'plan': org.plan,
        'clerk_org_id': org.clerk_org_id,
    })


@extend_schema(
    summary='Get current org usage stats',
    description=(
        'Returns the authenticated org\'s current-month generation usage, token consumption, '
        'estimated cost in USD/QAR/SAR, and plan details. Used by the usage dashboard.'
    ),
    responses={
        200: inline_serializer(
            name='OrgUsageResponse',
            fields={
                'plan': serializers.CharField(),
                'generations_used': serializers.IntegerField(),
                'generations_limit': serializers.IntegerField(allow_null=True),
                'tokens_in': serializers.IntegerField(),
                'tokens_out': serializers.IntegerField(),
                'cost_usd': serializers.FloatField(),
                'cost_qar': serializers.FloatField(),
                'cost_sar': serializers.FloatField(),
                'api_key_public': serializers.CharField(),
                'reset_date': serializers.DateField(),
            },
        ),
    },
    tags=['Organizations'],
)
@api_view(['GET'])
def org_usage(request):
    """
    Return current-month usage stats for the authenticated org.
    Aggregates AIUsage records for the current calendar month.
    Constitution Principle I: all queries scoped to request.org.
    """
    org = request.org
    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    agg = (
        AIUsage.objects.filter(org=org, created_at__gte=month_start, success=True)
        .aggregate(
            total_tokens_in=Sum('tokens_in'),
            total_tokens_out=Sum('tokens_out'),
            total_cost=Sum('cost_usd'),
        )
    )

    cost_usd = float(agg['total_cost'] or 0)
    limit = PLAN_LIMITS.get(org.plan)

    # Calculate next reset date (1st of next month)
    if now.month == 12:
        reset_date = date(now.year + 1, 1, 1)
    else:
        reset_date = date(now.year, now.month + 1, 1)

    return Response({
        'plan': org.plan,
        'generations_used': org.generations_used_this_month,
        'generations_limit': limit,  # None for Enterprise
        'tokens_in': agg['total_tokens_in'] or 0,
        'tokens_out': agg['total_tokens_out'] or 0,
        'cost_usd': round(cost_usd, 4),
        'cost_qar': round(cost_usd * CURRENCY_RATES['QAR'], 2),
        'cost_sar': round(cost_usd * CURRENCY_RATES['SAR'], 2),
        'api_key_public': org.api_key_public or '',
        'reset_date': reset_date.isoformat(),
    })


@extend_schema(
    summary='Rotate API key pair',
    description=(
        'Generates a new pk_live_xxx / sk_live_xxx key pair. '
        'Old pair is immediately invalidated. '
        'The secret key is returned ONCE in this response only \u2014 it cannot be retrieved again. '
        'Gated on FLAG_BILLING.'
    ),
    responses={
        200: inline_serializer(
            name='RotateKeyResponse',
            fields={
                'api_key_public': serializers.CharField(),
                'api_key_secret': serializers.CharField(),
                'rotated_at': serializers.DateTimeField(),
            },
        ),
        403: inline_serializer(
            name='RotateKeyForbidden',
            fields={
                'error': serializers.CharField(),
                'error_ar': serializers.CharField(),
            },
        ),
    },
    tags=['Organizations'],
)
@api_view(['POST'])
def rotate_key(request):
    """
    Generate a new API key pair and invalidate the old one atomically.
    Constitution Principle I: scoped to request.org only.
    Constitution Security Requirements: secret key Fernet-encrypted at rest.
    """
    if not is_enabled('BILLING'):
        return Response(
            {
                'error': 'Billing is not enabled.',
                'error_ar': 'الفوترة غير مفعّلة.',
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    org = request.org
    public_key, secret_plaintext, secret_encrypted = generate_key_pair()

    # Atomic update — old public key immediately invalidated
    org.api_key_public = public_key
    org.api_key_secret = secret_encrypted
    org.save(update_fields=['api_key_public', 'api_key_secret'])

    return Response({
        'api_key_public': public_key,
        'api_key_secret': secret_plaintext,  # Shown once only
        'rotated_at': timezone.now().isoformat(),
    })


@extend_schema(
    summary='Update organization name',
    description=(
        'Partially update the authenticated organization. '
        'Currently only the `name` field is writable. '
        'Constitution Principle I: scoped to request.org — no org_id in URL.'
    ),
    request=inline_serializer(
        name='OrgUpdateRequest',
        fields={
            'name': serializers.CharField(min_length=1, max_length=100),
        },
    ),
    responses={
        200: inline_serializer(
            name='OrgUpdateResponse',
            fields={
                'id': serializers.IntegerField(),
                'name': serializers.CharField(),
                'plan': serializers.CharField(),
                'reset_date': serializers.DateField(),
            },
        ),
        400: inline_serializer(
            name='OrgUpdateBadRequest',
            fields={
                'name': serializers.ListField(child=serializers.CharField()),
            },
        ),
    },
    tags=['Organizations'],
)
@api_view(['PATCH'])
def org_update(request):
    """
    Partially update the authenticated organization.
    Currently only the `name` field is writable.
    Constitution Principle I: scoped to request.org only.
    """
    from .serializers import OrgUpdateSerializer

    org = request.org
    serializer = OrgUpdateSerializer(org, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    now = timezone.now()
    if now.month == 12:
        reset_date = date(now.year + 1, 1, 1)
    else:
        reset_date = date(now.year, now.month + 1, 1)

    return Response({
        'id': org.id,
        'name': org.name,
        'plan': org.plan,
        'reset_date': reset_date.isoformat(),
    })

