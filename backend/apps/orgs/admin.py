import secrets
from django.contrib import admin
from django.db.models import Sum
from .models import Organization
from apps.billing.key_utils import generate_key_pair


@admin.action(description='Generate test API key pair (pk_test_xxx / sk_test_xxx)')
def generate_test_api_key_pair(modeladmin, request, queryset):
    for org in queryset:
        public_key, secret_plaintext, secret_encrypted = generate_key_pair()
        # Replace pk_live_ prefix with pk_test_ for test keys
        public_key = public_key.replace('pk_live_', 'pk_test_')
        org.api_key_public = public_key
        org.api_key_secret = secret_encrypted
        org.save(update_fields=['api_key_public', 'api_key_secret'])
    modeladmin.message_user(request, f'Generated test API key pairs for {queryset.count()} org(s).')


@admin.action(description='Reset monthly generation counter to 0')
def reset_generation_counter(modeladmin, request, queryset):
    updated = queryset.update(generations_used_this_month=0)
    modeladmin.message_user(request, f'Reset counter for {updated} org(s).')


@admin.action(description='Set plan → Free')
def set_plan_free(modeladmin, request, queryset):
    queryset.update(plan='free', monthly_generation_limit=20)
    modeladmin.message_user(request, f'Set {queryset.count()} org(s) to Free plan.')


@admin.action(description='Set plan → Starter')
def set_plan_starter(modeladmin, request, queryset):
    queryset.update(plan='starter', monthly_generation_limit=200)
    modeladmin.message_user(request, f'Set {queryset.count()} org(s) to Starter plan.')


@admin.action(description='Set plan → Pro')
def set_plan_pro(modeladmin, request, queryset):
    queryset.update(plan='pro', monthly_generation_limit=2000)
    modeladmin.message_user(request, f'Set {queryset.count()} org(s) to Pro plan.')


@admin.action(description='Set plan → Enterprise (unlimited)')
def set_plan_enterprise(modeladmin, request, queryset):
    queryset.update(plan='enterprise', monthly_generation_limit=999999)
    modeladmin.message_user(request, f'Set {queryset.count()} org(s) to Enterprise plan.')


def current_month_cost(obj):
    """Show estimated cost this month for the org."""
    from django.utils import timezone
    from apps.generate.models import AIUsage
    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    agg = AIUsage.objects.filter(org=obj, created_at__gte=month_start, success=True).aggregate(
        total=Sum('cost_usd')
    )
    cost = float(agg['total'] or 0)
    return f'${cost:.4f}'

current_month_cost.short_description = 'Cost (USD, this month)'


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'clerk_org_id', 'plan', 'is_active',
        'generations_used_this_month', 'monthly_generation_limit',
        'api_key_public', current_month_cost, 'created_at',
    ]
    list_filter = ['plan', 'is_active']
    search_fields = ['name', 'clerk_org_id', 'api_key_public', 'stripe_customer_id']
    readonly_fields = [
        'clerk_org_id', 'api_key_public', 'stripe_customer_id',
        'stripe_subscription_id', 'created_at', 'updated_at',
    ]
    ordering = ['-created_at']
    actions = [
        generate_test_api_key_pair,
        reset_generation_counter,
        set_plan_free,
        set_plan_starter,
        set_plan_pro,
        set_plan_enterprise,
    ]
    fieldsets = [
        ('Identity', {
            'fields': ['name', 'clerk_org_id', 'is_active'],
        }),
        ('Plan & Usage', {
            'fields': ['plan', 'monthly_generation_limit', 'generations_used_this_month'],
        }),
        ('API Keys', {
            'fields': ['api_key_public'],
            'description': 'Secret key is Fernet-encrypted and not displayed here. Use "Generate test API key pair" action to rotate.',
        }),
        ('Stripe Billing', {
            'fields': ['stripe_customer_id', 'stripe_subscription_id'],
            'classes': ['collapse'],
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse'],
        }),
    ]
