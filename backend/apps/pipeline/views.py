import logging
from decimal import Decimal

from django.db.models import Sum, Count, Q, OuterRef, Subquery
from django.utils import timezone
from django.utils.decorators import method_decorator
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.flags import require_flag
from .models import Deal, DealTask, PipelineNotification
from .serializers import (
    DealCardSerializer,
    DealCreateSerializer,
    DealDetailSerializer,
    DealUpdateSerializer,
    DealTaskCreateSerializer,
    DealTaskSerializer,
    DealTaskUpdateSerializer,
)

logger = logging.getLogger(__name__)

BOARD_STAGES = [
    ("NEW_MESSAGE", "New Message"),
    ("ENGAGED", "Engaged"),
    ("PRICE_SENT", "Price Sent"),
    ("ORDER_PLACED", "Order Placed"),
    ("PAID", "Paid"),
    ("LOST", "Lost"),
]


@method_decorator(require_flag("PIPELINE_ENABLED"), name="dispatch")
class PipelineBoardView(APIView):
    """GET /api/pipeline/ — Grouped pipeline view."""

    @extend_schema(
        operation_id="pipeline_board",
        tags=["Pipeline"],
        parameters=[
            OpenApiParameter(name="platform", type=str, required=False),
            OpenApiParameter(name="assignee", type=str, required=False),
            OpenApiParameter(name="score_min", type=int, required=False),
            OpenApiParameter(name="score_max", type=int, required=False),
            OpenApiParameter(name="date_from", type=str, required=False),
            OpenApiParameter(name="date_to", type=str, required=False),
        ],
    )
    def get(self, request):
        org = request.org
        qs = Deal.objects.filter(org=org).select_related("contact")

        # Apply filters
        filters = {}
        platform = request.query_params.get("platform")
        if platform:
            qs = qs.filter(source_platform=platform.upper())
            filters["platform"] = platform.upper()
        else:
            filters["platform"] = None

        assignee = request.query_params.get("assignee")
        if assignee:
            qs = qs.filter(assigned_to_clerk_user_id=assignee)
            filters["assignee"] = assignee
        else:
            filters["assignee"] = None

        score_min = request.query_params.get("score_min")
        if score_min:
            qs = qs.filter(ai_score__gte=int(score_min))
            filters["score_min"] = int(score_min)
        else:
            filters["score_min"] = None

        score_max = request.query_params.get("score_max")
        if score_max:
            qs = qs.filter(ai_score__lte=int(score_max))
            filters["score_max"] = int(score_max)
        else:
            filters["score_max"] = None

        date_from = request.query_params.get("date_from")
        if date_from:
            qs = qs.filter(updated_at__gte=date_from)
            filters["date_from"] = date_from
        else:
            filters["date_from"] = None

        date_to = request.query_params.get("date_to")
        if date_to:
            qs = qs.filter(updated_at__lte=date_to)
            filters["date_to"] = date_to
        else:
            filters["date_to"] = None

        # DB-level aggregation for stage totals
        stage_stats = (
            Deal.objects.filter(org=org)
            .values("stage")
            .annotate(
                stage_total=Sum("value"),
                stage_count=Count("id"),
            )
        )
        stats_by_stage = {s["stage"]: s for s in stage_stats}

        # Annotate deals with latest message preview and unread alert flag
        from apps.inbox.models import Message

        latest_msg = (
            Message.objects.filter(
                contact=OuterRef("contact__pk"),
            )
            .order_by("-sent_at", "-created_at")
            .values("content")[:1]
        )

        unread_alerts = PipelineNotification.objects.filter(
            deal=OuterRef("pk"),
            read_at__isnull=True,
        )

        deals_qs = qs.annotate(
            latest_message_preview=Subquery(latest_msg),
            has_unread_alert=unread_alerts.exists(),
        ).order_by("-ai_score", "-updated_at")

        # Build stage groups from DB results
        stages = []
        aggregate_total = Decimal("0.00")
        for stage_key, stage_label in BOARD_STAGES:
            stage_deals = [d for d in deals_qs if d.stage == stage_key]
            stats = stats_by_stage.get(stage_key, {})
            total_value = stats.get("stage_total") or Decimal("0.00")
            aggregate_total += total_value
            stages.append(
                {
                    "stage": stage_key,
                    "label": stage_label,
                    "total_value": str(total_value),
                    "count": stats.get("stage_count", 0),
                    "deals": DealCardSerializer(stage_deals, many=True).data,
                }
            )

        return Response(
            {
                "stages": stages,
                "aggregate_total_value": str(aggregate_total),
                "applied_filters": filters,
            }
        )


@method_decorator(require_flag("PIPELINE_ENABLED"), name="dispatch")
class DealCreateView(APIView):
    """POST /api/deals/ — Create a manual deal."""

    @extend_schema(
        operation_id="deal_create", tags=["Pipeline"], request=DealCreateSerializer
    )
    def post(self, request):
        org = request.org
        serializer = DealCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "error": "Invalid deal data.",
                    "error_ar": "بيانات الصفقة غير صالحة.",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        from .services.deals import create_manual_deal

        deal = create_manual_deal(org, serializer.validated_data)

        return Response(
            {
                "id": deal.pk,
                "title": deal.title,
                "stage": deal.stage,
                "priority": deal.priority,
                "ai_score": deal.ai_score,
                "value": str(deal.value) if deal.value else None,
                "notes": deal.notes,
                "created_at": deal.created_at,
            },
            status=status.HTTP_201_CREATED,
        )


@method_decorator(require_flag("PIPELINE_ENABLED"), name="dispatch")
class DealDetailView(APIView):
    """GET /api/deals/{id}/ — Deal detail. PATCH /api/deals/{id}/ — Update deal."""

    @extend_schema(operation_id="deal_detail", tags=["Pipeline"])
    def get(self, request, deal_id):
        org = request.org
        try:
            deal = (
                Deal.objects.select_related("contact")
                .prefetch_related(
                    "tasks",
                    "notifications",
                )
                .get(pk=deal_id, org=org)
            )
        except Deal.DoesNotExist:
            return Response(
                {"error": "Deal not found.", "error_ar": "الصفقة غير موجودة."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(DealDetailSerializer(deal).data)

    @extend_schema(
        operation_id="deal_update", tags=["Pipeline"], request=DealUpdateSerializer
    )
    def patch(self, request, deal_id):
        org = request.org
        try:
            deal = Deal.objects.get(pk=deal_id, org=org)
        except Deal.DoesNotExist:
            return Response(
                {"error": "Deal not found.", "error_ar": "الصفقة غير موجودة."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = DealUpdateSerializer(deal, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                {
                    "error": "Invalid update data.",
                    "error_ar": "بيانات التحديث غير صالحة.",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Business rules for stage transitions
        old_stage = deal.stage
        new_stage = serializer.validated_data.get("stage")
        if new_stage in ("PAID", "LOST") and not deal.closed_at:
            deal.closed_at = timezone.now()

        serializer.save()

        # Phase 10 — Fire deal_stage_changed PostHog event when stage changes
        if new_stage and new_stage != old_stage:
            try:
                from apps.core.analytics import capture
                capture('deal_stage_changed', request.org, {
                    'deal_id': deal.pk,
                    'from_stage': old_stage,
                    'to_stage': new_stage,
                })
            except Exception:
                pass

        return Response(
            {
                "id": deal.pk,
                "stage": deal.stage,
                "value": str(deal.value) if deal.value else None,
                "notes": deal.notes,
                "assigned_to": {
                    "clerk_user_id": deal.assigned_to_clerk_user_id,
                    "name": deal.assigned_to_name,
                },
                "updated_at": deal.updated_at,
            }
        )


@method_decorator(require_flag("PIPELINE_ENABLED"), name="dispatch")
class DealTaskCreateView(APIView):
    """POST /api/deals/{deal_id}/tasks/ — Create a task for a deal."""

    @extend_schema(
        operation_id="deal_task_create",
        tags=["Pipeline"],
        request=DealTaskCreateSerializer,
    )
    def post(self, request, deal_id):
        org = request.org
        try:
            deal = Deal.objects.get(pk=deal_id, org=org)
        except Deal.DoesNotExist:
            return Response(
                {"error": "Deal not found.", "error_ar": "الصفقة غير موجودة."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = DealTaskCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "error": "Invalid task data.",
                    "error_ar": "بيانات المهمة غير صالحة.",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        task = DealTask.objects.create(
            org=org,
            deal=deal,
            **serializer.validated_data,
        )

        return Response(
            {
                "id": task.pk,
                "title": task.title,
                "description": task.description,
                "due_at": task.due_at,
                "completed_at": task.completed_at,
            },
            status=status.HTTP_201_CREATED,
        )


@method_decorator(require_flag("PIPELINE_ENABLED"), name="dispatch")
class DealTaskUpdateView(APIView):
    """PATCH /api/tasks/{task_id}/ — Update / complete a task."""

    @extend_schema(
        operation_id="deal_task_update",
        tags=["Pipeline"],
        request=DealTaskUpdateSerializer,
    )
    def patch(self, request, task_id):
        org = request.org
        try:
            task = DealTask.objects.get(pk=task_id, org=org)
        except DealTask.DoesNotExist:
            return Response(
                {"error": "Task not found.", "error_ar": "المهمة غير موجودة."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = DealTaskUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "error": "Invalid task data.",
                    "error_ar": "بيانات المهمة غير صالحة.",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        if data.get("completed") is True and not task.completed_at:
            task.completed_at = timezone.now()
        elif data.get("completed") is False:
            task.completed_at = None

        if "title" in data:
            task.title = data["title"]
        if "description" in data:
            task.description = data["description"]
        if "due_at" in data:
            task.due_at = data["due_at"]

        task.save()

        return Response(
            {
                "id": task.pk,
                "completed_at": task.completed_at,
            }
        )


@method_decorator(require_flag("PIPELINE_ENABLED"), name="dispatch")
class NotificationListView(APIView):
    """GET /api/notifications/ — Notification bell data."""

    @extend_schema(operation_id="notification_list", tags=["Pipeline"])
    def get(self, request):
        org = request.org
        notifications = (
            PipelineNotification.objects.filter(
                org=org,
            )
            .select_related("deal")
            .order_by("-created_at")[:50]
        )

        unread_count = PipelineNotification.objects.filter(
            org=org,
            read_at__isnull=True,
        ).count()

        results = [
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

        return Response(
            {
                "unread_count": unread_count,
                "results": results,
            }
        )


@method_decorator(require_flag("PIPELINE_ENABLED"), name="dispatch")
class NotificationMarkReadView(APIView):
    """POST /api/notifications/{id}/mark-read/ — Mark notification as read."""

    @extend_schema(operation_id="notification_mark_read", tags=["Pipeline"])
    def post(self, request, notification_id):
        org = request.org
        try:
            notification = PipelineNotification.objects.get(
                pk=notification_id,
                org=org,
            )
        except PipelineNotification.DoesNotExist:
            return Response(
                {"error": "Notification not found.", "error_ar": "الإشعار غير موجود."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not notification.read_at:
            notification.read_at = timezone.now()
            notification.save(update_fields=["read_at", "updated_at"])

        return Response({"id": notification.pk, "read_at": notification.read_at})


@method_decorator(require_flag("PIPELINE_ENABLED"), name="dispatch")
class NotificationMarkAllReadView(APIView):
    """POST /api/notifications/mark-all-read/ — Mark all notifications as read."""

    @extend_schema(operation_id="notification_mark_all_read", tags=["Pipeline"])
    def post(self, request):
        org = request.org
        now = timezone.now()
        updated = PipelineNotification.objects.filter(
            org=org,
            read_at__isnull=True,
        ).update(read_at=now)

        return Response({"marked_read": updated})
