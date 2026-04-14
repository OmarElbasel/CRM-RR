from rest_framework import serializers

from .models import PostSchedule, BroadcastMessage


class PostScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSchedule
        fields = [
            "id",
            "platform",
            "content",
            "media_url",
            "scheduled_at",
            "status",
            "published_at",
            "error_message",
            "created_at",
        ]
        read_only_fields = ["status", "published_at", "error_message", "created_at"]

    def validate_scheduled_at(self, value):
        from django.utils import timezone

        if value <= timezone.now():
            raise serializers.ValidationError("scheduled_at must be in the future.")
        return value

    def validate(self, data):
        from apps.inbox.models import SocialChannel

        org = self.context.get("org")
        platform = data.get("platform")
        if org and platform:
            has_channel = SocialChannel.objects.filter(
                org=org, platform=platform, is_active=True
            ).exists()
            if not has_channel:
                raise serializers.ValidationError(
                    f"No active {platform} channel found for your organization."
                )
        return data

    def create(self, validated_data):
        from apps.inbox.models import SocialChannel

        org = self.context.get("org")
        platform = validated_data.get("platform")
        channel = SocialChannel.objects.filter(
            org=org, platform=platform, is_active=True
        ).first()
        return PostSchedule.objects.create(channel=channel, **validated_data)


class BroadcastMessageCreateSerializer(serializers.Serializer):
    template_name = serializers.CharField(max_length=255)
    message_ar = serializers.CharField()
    message_en = serializers.CharField()
    recipients = serializers.ListField(child=serializers.CharField())
    scheduled_at = serializers.DateTimeField(required=False, allow_null=True)

    def validate_recipients(self, value):
        if not value:
            raise serializers.ValidationError("At least one recipient is required.")
        return value


class BroadcastMessageSerializer(serializers.ModelSerializer):
    recipient_count = serializers.SerializerMethodField()

    class Meta:
        model = BroadcastMessage
        fields = [
            "id",
            "template_name",
            "status",
            "recipient_count",
            "sent_count",
            "failed_count",
            "sent_at",
            "created_at",
        ]

    def get_recipient_count(self, obj):
        return len(obj.recipients)
