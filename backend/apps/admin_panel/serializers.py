from rest_framework import serializers
from apps.orgs.models import Organization
from apps.generate.models import AIUsage

class AIUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIUsage
        fields = [
            'model', 'tokens_in', 'tokens_out', 'cost_usd', 
            'language', 'cache_hit', 'success', 'created_at'
        ]

class ModelUsageSerializer(serializers.Serializer):
    model = serializers.CharField()
    call_count = serializers.IntegerField()
    tokens_in = serializers.IntegerField()
    tokens_out = serializers.IntegerField()
    cost_usd = serializers.DecimalField(max_digits=12, decimal_places=6)
    cache_hit_pct = serializers.FloatField()

class DailyUsageSerializer(serializers.Serializer):
    date = serializers.DateField()
    cost_usd = serializers.DecimalField(max_digits=12, decimal_places=2)
    generation_count = serializers.IntegerField()

class AIUsageAggregateSerializer(serializers.Serializer):
    summary = serializers.DictField()
    by_model = ModelUsageSerializer(many=True)
    daily = DailyUsageSerializer(many=True)

class OrgListSerializer(serializers.ModelSerializer):
    usage_pct = serializers.SerializerMethodField()
    cost_usd_this_month = serializers.DecimalField(max_digits=12, decimal_places=6, read_only=True)

    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'clerk_org_id', 'plan', 'is_active',
            'generations_used_this_month', 'monthly_generation_limit',
            'usage_pct', 'cost_usd_this_month', 'stripe_customer_id',
            'owner_email', 'created_at'
        ]

    def get_usage_pct(self, obj):
        if not obj.monthly_generation_limit:
            return 0
        return int((obj.generations_used_this_month / obj.monthly_generation_limit) * 100)

class OrgDetailSerializer(serializers.ModelSerializer):
    recent_generations = AIUsageSerializer(many=True, read_only=True)

    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'clerk_org_id', 'plan', 'is_active', 
            'ai_suspended', 'generations_used_this_month', 
            'monthly_generation_limit', 'monthly_cost_usd', 
            'monthly_cost_cap_usd', 'stripe_customer_id', 
            'stripe_subscription_id', 'owner_email', 
            'created_at', 'recent_generations'
        ]
