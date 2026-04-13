from rest_framework import serializers


class CreateCheckoutSerializer(serializers.Serializer):
    PLAN_CHOICES = [('starter', 'Starter'), ('pro', 'Pro'), ('enterprise', 'Enterprise')]
    plan = serializers.ChoiceField(choices=PLAN_CHOICES)
    success_url = serializers.URLField(required=False, default='')
    cancel_url = serializers.URLField(required=False, default='')
