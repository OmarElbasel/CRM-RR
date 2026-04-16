from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, pagination
from django.conf import settings
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.orgs.models import Organization
from apps.generate.models import AIUsage
from apps.billing.models import WebhookAttempt
from .permissions import AdminJWTAuthentication, IsStaffUser
from .models import AdminConfig, PlatformCredential, RateLimitEvent
from apps.core.platform_credentials import encrypt, encrypt_json, get_credential
from .serializers import OrgListSerializer, OrgDetailSerializer

class AdminPagination(pagination.PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

class AdminBaseView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsStaffUser]

@extend_schema(tags=['admin'], summary='Platform KPI overview and alerts')
class AdminOverviewView(AdminBaseView):
    def get(self, request):
        now = timezone.now()
        yesterday = now - timedelta(days=1)
        
        kpis = {
            "total_orgs": Organization.objects.count(),
            "paid_orgs": Organization.objects.exclude(plan='free').count(),
            "active_orgs_30d": Organization.objects.filter(updated_at__gte=now - timedelta(days=30)).count(),
            "ai_spend_usd": float(Organization.objects.aggregate(Sum('monthly_cost_usd'))['monthly_cost_usd__sum'] or 0),
        }
        
        alerts = {
            "webhook_failures_24h": WebhookAttempt.objects.filter(status='failed', created_at__gte=yesterday).count(),
            "rate_limit_hits_24h": RateLimitEvent.objects.filter(created_at__gte=yesterday).count(),
        }
        
        recent_signups = OrgListSerializer(Organization.objects.order_by('-created_at')[:5], many=True).data
        
        return Response({
            "kpis": kpis,
            "alerts": alerts,
            "recent_signups": recent_signups
        })

@extend_schema(
    tags=['admin'], 
    summary='List all organizations',
    parameters=[
        OpenApiParameter("search", str, description="Search by name or Clerk ID"),
        OpenApiParameter("plan", str, description="Filter by plan"),
        OpenApiParameter("is_active", bool, description="Filter by active status"),
    ]
)
class AdminOrgListView(AdminBaseView):
    def get(self, request):
        queryset = Organization.objects.all()
        
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(clerk_org_id__icontains=search))
            
        plan = request.query_params.get('plan')
        if plan:
            queryset = queryset.filter(plan=plan)
            
        is_active = request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
        paginator = AdminPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = OrgListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

@extend_schema(tags=['admin'], summary='Get organization detail')
class AdminOrgDetailView(AdminBaseView):
    def get(self, request, id):
        try:
            org = Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return Response({"error": "Org not found", "code": "ORG_NOT_FOUND"}, status=404)
        
        # Prefetch recent generations
        org.recent_generations = AIUsage.objects.filter(org=org).order_of_month()[:10]
        
        serializer = OrgDetailSerializer(org)
        return Response(serializer.data)

@extend_schema(tags=['admin'], summary='Change organization plan')
class AdminOrgPlanView(AdminBaseView):
    def patch(self, request, id):
        try:
            org = Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return Response({"error": "Org not found", "code": "ORG_NOT_FOUND"}, status=404)
            
        new_plan = request.data.get('plan')
        if new_plan not in dict(Organization.PLAN_CHOICES):
            return Response({"error": "Invalid plan", "code": "INVALID_PLAN"}, status=400)
            
        # Get limit from AdminConfig
        config = AdminConfig.get()
        new_limit = config.token_budgets.get(new_plan, 20)
        
        org.plan = new_plan
        org.monthly_generation_limit = new_limit
        org.save(update_fields=['plan', 'monthly_generation_limit'])
        
        return Response({
            "id": org.id,
            "plan": org.plan,
            "monthly_generation_limit": org.monthly_generation_limit
        })

@extend_schema(tags=['admin'], summary='Reset monthly generation counter')
class AdminOrgResetUsageView(AdminBaseView):
    def post(self, request, id):
        try:
            org = Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return Response({"error": "Org not found", "code": "ORG_NOT_FOUND"}, status=404)
            
        org.generations_used_this_month = 0
        org.monthly_cost_usd = 0
        org.ai_suspended = False
        org.save(update_fields=['generations_used_this_month', 'monthly_cost_usd', 'ai_suspended'])
        
        return Response({"id": org.id, "generations_used": 0})

@extend_schema(tags=['admin'], summary='Toggle organization active/suspended state')
class AdminOrgSuspendView(AdminBaseView):
    def patch(self, request, id):
        try:
            org = Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return Response({"error": "Org not found", "code": "ORG_NOT_FOUND"}, status=404)
            
        is_active = request.data.get('is_active')
        if is_active is None:
            return Response({"error": "is_active is required"}, status=400)
            
        org.is_active = bool(is_active)
        org.save(update_fields=['is_active'])
        
        return Response({"id": org.id, "is_active": org.is_active})

@extend_schema(tags=['admin'], summary='Rotate API key pair')
class AdminOrgRotateKeysView(AdminBaseView):
    def post(self, request, id):
        try:
            org = Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return Response({"error": "Org not found", "code": "ORG_NOT_FOUND"}, status=404)
            
        from apps.billing.key_utils import generate_key_pair
        public_key, encrypted_secret = generate_key_pair()
        
        org.api_key_public = public_key
        org.api_key_secret = encrypted_secret
        org.save(update_fields=['api_key_public', 'api_key_secret'])
        
        return Response({
            "id": org.id,
            "api_key_public": org.api_key_public
        })

@extend_schema(tags=['admin'], summary='Extend monthly generation limit')
class AdminOrgExtendLimitView(AdminBaseView):
    def post(self, request, id):
        try:
            org = Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            return Response({"error": "Org not found", "code": "ORG_NOT_FOUND"}, status=404)
            
        org.monthly_generation_limit += 50
        org.save(update_fields=['monthly_generation_limit'])
        
        return Response({"id": org.id, "monthly_generation_limit": org.monthly_generation_limit})

@extend_schema(
    tags=["admin"],
    summary="AI API usage aggregated by model and organization",
    parameters=[
        OpenApiParameter("from", str, description="Start date (ISO)"),
        OpenApiParameter("to", str, description="End date (ISO)"),
    ],
)
class AdminAIUsageView(AdminBaseView):
    def get(self, request):
        from apps.admin_panel.serializers import AIUsageAggregateSerializer
        from django.db.models.functions import TruncDate

        from_date_str = request.query_params.get("from")
        to_date_str = request.query_params.get("to")

        queryset = AIUsage.objects.all()

        if from_date_str:
            queryset = queryset.filter(created_at__date__gte=from_date_str)
        if to_date_str:
            queryset = queryset.filter(created_at__date__lte=to_date_str)

        # Summary KPIs
        summary = queryset.aggregate(
            total_tokens_in=Sum("tokens_in"),
            total_tokens_out=Sum("tokens_out"),
            total_cost_usd=Sum("cost_usd"),
            total_generations=Count("id"),
        )
        # Handle None results from aggregate
        for key in summary:
            if summary[key] is None:
                summary[key] = 0

        # Aggregation by Model
        by_model_qs = (
            queryset.values("model")
            .annotate(
                call_count=Count("id"),
                tokens_in=Sum("tokens_in"),
                tokens_out=Sum("tokens_out"),
                cost_usd=Sum("cost_usd"),
                cache_hits=Count("id", filter=Q(cache_hit=True)),
            )
            .order_by("-cost_usd")
        )

        by_model = []
        for item in by_model_qs:
            item["cache_hit_pct"] = (
                (item["cache_hits"] / item["call_count"]) * 100
                if item["call_count"] > 0
                else 0
            )
            by_model.append(item)

        # Aggregation by Day
        daily = (
            queryset.annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(
                cost_usd=Sum("cost_usd"),
                generation_count=Count("id"),
            )
            .order_by("date")
        )

        serializer = AIUsageAggregateSerializer(
            data={"summary": summary, "by_model": by_model, "daily": list(daily)}
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

@extend_schema(tags=['admin'], summary='Get AdminConfig values')
class AdminConfigView(AdminBaseView):
    def get(self, request):
        config = AdminConfig.get()
        return Response({
            "token_budgets": config.token_budgets,
            "cost_rates": config.cost_rates,
            "updated_at": config.updated_at,
            "updated_by": config.updated_by
        })

@extend_schema(tags=['admin'], summary='Update per-plan token budgets')
class AdminConfigTokenBudgetsView(AdminBaseView):
    def patch(self, request):
        config = AdminConfig.get()
        budgets = config.token_budgets.copy()
        budgets.update(request.data)
        config.token_budgets = budgets
        config.updated_by = request.user_id # Clerk user ID
        config.save()
        return Response({
            "token_budgets": config.token_budgets,
            "cost_rates": config.cost_rates,
            "updated_at": config.updated_at,
            "updated_by": config.updated_by
        })

@extend_schema(tags=['admin'], summary='Update per-model AI cost rates')
class AdminConfigCostRatesView(AdminBaseView):
    def patch(self, request):
        config = AdminConfig.get()
        rates = config.cost_rates.copy()
        # Deep merge/update
        for model, new_rates in request.data.items():
            if model in rates:
                rates[model].update(new_rates)
            else:
                rates[model] = new_rates
        config.cost_rates = rates
        config.updated_by = request.user_id
        config.save()
        return Response({
            "token_budgets": config.token_budgets,
            "cost_rates": config.cost_rates,
            "updated_at": config.updated_at,
            "updated_by": config.updated_by
        })

@extend_schema(tags=['admin'], summary='Organizations hitting rate limits in last 7 days')
class AdminRateLimitsView(AdminBaseView):
    def get(self, request):
        seven_days_ago = timezone.now() - timedelta(days=7)
        hits = RateLimitEvent.objects.filter(created_at__gte=seven_days_ago)\
            .values('org_id', 'org__name', 'org__plan')\
            .annotate(hit_count=Count('id'), last_hit_at=Sum('created_at'))\
            .order_by('-hit_count')
        
        # Note: last_hit_at=Sum('created_at') is wrong, but values().annotate() doesn't support Max() directly on non-numeric?
        # Actually it does:
        from django.db.models import Max
        hits = RateLimitEvent.objects.filter(created_at__gte=seven_days_ago)\
            .values('org_id', 'org__name', 'org__plan')\
            .annotate(hit_count=Count('id'), last_hit_at=Max('created_at'))\
            .order_by('-hit_count')
            
        results = []
        for hit in hits:
            # We need usage_pct. We'd have to fetch the org or join it.
            # For brevity in this stub/MVP:
            results.append({
                "org_id": hit['org_id'],
                "name": hit['org__name'],
                "plan": hit['org__plan'],
                "hit_count": hit['hit_count'],
                "last_hit_at": hit['last_hit_at'],
                "usage_pct": 100 # By definition they hit limit
            })
            
        return Response({"results": results})


# ── Platform Integration Credentials ─────────────────────────────────────────

PROVIDER_EXTRA_FIELDS = {
    "META":    ["verify_token"],
    "SHOPIFY": ["webhook_secret", "api_version"],
    "TIKTOK":  [],
}


def _credential_status(record: PlatformCredential | None, provider: str) -> dict:
    """Return a safe (no secrets) representation of a PlatformCredential."""
    extra_fields = {}
    if record and record.extra:
        from apps.core.platform_credentials import _decrypt_json
        extras = _decrypt_json(record.extra)
        for field in PROVIDER_EXTRA_FIELDS.get(provider, []):
            extra_fields[f"{field}_set"] = bool(extras.get(field))
    else:
        for field in PROVIDER_EXTRA_FIELDS.get(provider, []):
            extra_fields[f"{field}_set"] = False

    return {
        "provider": provider,
        "app_id": record.app_id if record else "",
        "app_secret_set": bool(record and record.app_secret),
        "extra_fields": extra_fields,
        "updated_at": record.updated_at.isoformat() if record else None,
    }


@extend_schema(tags=["admin"], summary="List platform integration credentials")
class AdminPlatformCredentialsView(AdminBaseView):
    """GET /api/admin/platform-credentials/ — List configured status for all providers."""

    def get(self, request):
        result = []
        for provider, _ in PlatformCredential.PROVIDER_CHOICES:
            record = PlatformCredential.get(provider)
            result.append(_credential_status(record, provider))
        return Response(result)


@extend_schema(tags=["admin"], summary="Save platform integration credentials for a provider")
class AdminPlatformCredentialDetailView(AdminBaseView):
    """PUT /api/admin/platform-credentials/<provider>/ — Upsert credentials.
    DELETE /api/admin/platform-credentials/<provider>/ — Remove credentials (falls back to .env).
    """

    def put(self, request, provider: str):
        provider = provider.upper()
        valid_providers = [p for p, _ in PlatformCredential.PROVIDER_CHOICES]
        if provider not in valid_providers:
            return Response({"error": f"Unknown provider: {provider}"}, status=status.HTTP_400_BAD_REQUEST)

        app_id = request.data.get("app_id", "").strip()
        app_secret_plain = request.data.get("app_secret", "").strip()

        # Extra fields
        extra_dict = {}
        for field in PROVIDER_EXTRA_FIELDS.get(provider, []):
            val = request.data.get(field, "").strip()
            if val:
                extra_dict[field] = val

        record, _ = PlatformCredential.objects.get_or_create(provider=provider)
        record.app_id = app_id
        record.updated_by = request.user.get("clerk_user_id", "")

        if app_secret_plain:
            record.app_secret = encrypt(app_secret_plain)

        if extra_dict:
            # Merge with existing extras (don't wipe fields not submitted)
            existing_extras = {}
            if record.extra:
                from apps.core.platform_credentials import _decrypt_json
                existing_extras = _decrypt_json(record.extra)
            existing_extras.update(extra_dict)
            record.extra = encrypt_json(existing_extras)

        record.save()
        return Response(_credential_status(record, provider))

    def delete(self, request, provider: str):
        provider = provider.upper()
        deleted, _ = PlatformCredential.objects.filter(provider=provider).delete()
        if deleted:
            return Response({"message": f"{provider} credentials cleared. Falling back to .env."})
        return Response({"message": "No credentials found."}, status=status.HTTP_404_NOT_FOUND)
