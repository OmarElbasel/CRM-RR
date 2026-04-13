"""
Organization serializers.
Constitution Principle I: All data scoped to the authenticated org.
Constitution Principle V: All serializers used in @extend_schema decorators.
"""
from rest_framework import serializers

from .models import Organization


class OrgUpdateSerializer(serializers.ModelSerializer):
    """Serializer for partial org updates. Only 'name' is writable in this phase."""

    class Meta:
        model = Organization
        fields = ['name']
        extra_kwargs = {
            'name': {'required': True, 'min_length': 1, 'max_length': 100},
        }


class OrgDetailSerializer(serializers.ModelSerializer):
    """Read-only representation returned after an org update."""

    class Meta:
        model = Organization
        fields = ['id', 'name', 'plan', 'reset_date']

    reset_date = serializers.SerializerMethodField()

    def get_reset_date(self, obj):
        from datetime import date
        from django.utils import timezone
        now = timezone.now()
        if now.month == 12:
            return date(now.year + 1, 1, 1).isoformat()
        return date(now.year, now.month + 1, 1).isoformat()
