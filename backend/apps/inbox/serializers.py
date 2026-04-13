from rest_framework import serializers
from .models import SocialChannel, Contact, Message


class ChannelSerializer(serializers.ModelSerializer):
    """Serializer for SocialChannel — NEVER exposes access_token."""

    class Meta:
        model = SocialChannel
        fields = [
            'id', 'platform', 'is_active', 'connected_at',
            'token_expires_at', 'page_id', 'phone_number_id',
        ]
        read_only_fields = fields


class MessageSerializer(serializers.ModelSerializer):
    """Full message detail for thread view."""

    class Meta:
        model = Message
        fields = [
            'id', 'direction', 'content', 'content_ar',
            'intent', 'ai_draft', 'ai_draft_ar',
            'read', 'sent_at',
        ]
        read_only_fields = fields


class LatestMessageSerializer(serializers.ModelSerializer):
    """Compact message for inbox list latest_message field."""

    class Meta:
        model = Message
        fields = ['id', 'content', 'intent', 'sent_at', 'direction']
        read_only_fields = fields


class ContactSummarySerializer(serializers.Serializer):
    """Contact summary for inbox list — one row per contact."""
    contact_id = serializers.IntegerField(source='id')
    contact_name = serializers.CharField(source='name')
    platform = serializers.CharField()
    ai_score = serializers.IntegerField()
    unread_count = serializers.IntegerField()
    latest_message = LatestMessageSerializer()


class ReplySerializer(serializers.Serializer):
    """Validates reply content — non-blank required."""
    content = serializers.CharField(min_length=1)
