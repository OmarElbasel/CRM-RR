from rest_framework import serializers

from .models import Deal, DealTask, PipelineNotification


class AssigneeField(serializers.Serializer):
    clerk_user_id = serializers.CharField(source="assigned_to_clerk_user_id")
    name = serializers.CharField(source="assigned_to_name")


class ContactSummarySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    platform = serializers.CharField()


class DealCardSerializer(serializers.ModelSerializer):
    contact = ContactSummarySerializer(read_only=True)
    assigned_to = AssigneeField(source="*", read_only=True)
    latest_message_preview = serializers.CharField(read_only=True)
    has_unread_alert = serializers.BooleanField(read_only=True)

    class Meta:
        model = Deal
        fields = [
            "id",
            "title",
            "contact",
            "value",
            "priority",
            "ai_score",
            "assigned_to",
            "latest_message_preview",
            "last_customer_message_at",
            "has_unread_alert",
        ]


class StageGroupSerializer(serializers.Serializer):
    stage = serializers.CharField()
    label = serializers.CharField()
    total_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    count = serializers.IntegerField()
    deals = DealCardSerializer(many=True)


class PipelineBoardSerializer(serializers.Serializer):
    stages = StageGroupSerializer(many=True)
    aggregate_total_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    applied_filters = serializers.DictField()


class DealCreateSerializer(serializers.ModelSerializer):
    contact_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Deal
        fields = [
            "title",
            "contact_id",
            "value",
            "stage",
            "priority",
            "assigned_to_clerk_user_id",
            "assigned_to_name",
            "notes",
            "due_at",
        ]

    def validate_stage(self, value):
        valid = {c[0] for c in Deal.STAGE_CHOICES}
        if value not in valid:
            raise serializers.ValidationError(
                {"error": "Stage is invalid.", "error_ar": "مرحلة الصفقة غير صالحة."}
            )
        return value


class ContactDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    platform = serializers.CharField()
    platform_id = serializers.CharField()
    ai_score = serializers.IntegerField()
    total_spend = serializers.DecimalField(max_digits=12, decimal_places=2)


class MessageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    direction = serializers.CharField()
    content = serializers.CharField()
    intent = serializers.CharField(allow_null=True)
    sent_at = serializers.DateTimeField()


class DealTaskSerializer(serializers.ModelSerializer):
    assigned_to = AssigneeField(source="*", read_only=True)

    class Meta:
        model = DealTask
        fields = [
            "id",
            "title",
            "description",
            "due_at",
            "completed_at",
            "assigned_to",
        ]
        read_only_fields = ["id", "completed_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipelineNotification
        fields = [
            "id",
            "notification_type",
            "priority",
            "title",
            "body",
            "body_ar",
            "draft_en",
            "draft_ar",
            "read_at",
            "created_at",
        ]


class DealDetailSerializer(serializers.ModelSerializer):
    contact = serializers.SerializerMethodField()
    assigned_to = AssigneeField(source="*", read_only=True)
    messages = serializers.SerializerMethodField()
    tasks = DealTaskSerializer(many=True, read_only=True)
    notifications = NotificationSerializer(many=True, read_only=True)

    class Meta:
        model = Deal
        fields = [
            "id",
            "title",
            "stage",
            "priority",
            "value",
            "ai_score",
            "assigned_to",
            "contact",
            "notes",
            "lost_reason",
            "due_at",
            "closed_at",
            "messages",
            "tasks",
            "notifications",
        ]

    def get_contact(self, obj):
        if not obj.contact:
            return None
        c = obj.contact
        return ContactDetailSerializer(
            {
                "id": c.pk,
                "name": c.name,
                "platform": c.platform,
                "platform_id": c.platform_id,
                "ai_score": c.ai_score,
                "total_spend": c.total_spend,
            }
        ).data

    def get_messages(self, obj):
        if not obj.contact:
            return []
        msgs = obj.contact.messages.order_by("sent_at", "created_at")
        return MessageSerializer(msgs, many=True).data


class DealUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = [
            "stage",
            "value",
            "priority",
            "notes",
            "lost_reason",
            "assigned_to_clerk_user_id",
            "assigned_to_name",
            "due_at",
        ]
        extra_kwargs = {f: {"required": False} for f in fields}

    def validate(self, attrs):
        stage = attrs.get("stage")
        if (
            stage == "LOST"
            and not attrs.get("lost_reason")
            and not (self.instance and self.instance.lost_reason)
        ):
            raise serializers.ValidationError(
                {
                    "error": "Lost reason is required when moving to LOST.",
                    "error_ar": "سبب الخسارة مطلوب عند نقل الصفقة إلى خاسرة.",
                }
            )
        return attrs


class DealTaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DealTask
        fields = [
            "title",
            "description",
            "due_at",
            "assigned_to_clerk_user_id",
            "assigned_to_name",
        ]


class DealTaskUpdateSerializer(serializers.Serializer):
    completed = serializers.BooleanField(required=False)
    title = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    due_at = serializers.DateTimeField(required=False, allow_null=True)


class NotificationBellSerializer(serializers.Serializer):
    unread_count = serializers.IntegerField()
    results = serializers.SerializerMethodField()

    def get_results(self, obj):
        notifications = obj["results"]
        return [
            {
                "id": n.pk,
                "deal_id": n.deal_id,
                "notification_type": n.notification_type,
                "priority": n.priority,
                "title": n.title,
                "body": n.body,
                "body_ar": n.body_ar,
                "created_at": n.created_at,
                "read_at": n.read_at,
            }
            for n in notifications
        ]
