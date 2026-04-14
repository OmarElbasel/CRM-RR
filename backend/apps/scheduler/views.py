from django.utils.decorators import method_decorator
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from apps.core.flags import require_flag

from .models import PostSchedule, BroadcastMessage
from .serializers import (
    PostScheduleSerializer,
    BroadcastMessageSerializer,
    BroadcastMessageCreateSerializer,
)


@method_decorator(require_flag("POST_SCHEDULER"), name="dispatch")
@extend_schema(tags=["Scheduler"])
class PostScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = PostScheduleSerializer

    def get_queryset(self):
        qs = PostSchedule.objects.filter(org=self.request.org)
        status_filter = self.request.query_params.get("status")
        platform_filter = self.request.query_params.get("platform")
        from_date = self.request.query_params.get("from")
        to_date = self.request.query_params.get("to")

        if status_filter:
            qs = qs.filter(status=status_filter.upper())
        if platform_filter:
            qs = qs.filter(platform=platform_filter.upper())
        if from_date:
            qs = qs.filter(scheduled_at__gte=from_date)
        if to_date:
            qs = qs.filter(scheduled_at__lte=to_date)

        return qs.order_by("scheduled_at")

    def perform_create(self, serializer):
        serializer.save(org=self.request.org)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["org"] = self.request.org
        return context

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != "PENDING":
            raise ValidationError(
                {
                    "detail": "Only PENDING posts can be edited",
                    "detail_ar": "يمكن تعديل المنشورات المعلقة فقط",
                }
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != "PENDING":
            raise ValidationError(
                {
                    "detail": "Only PENDING posts can be deleted",
                    "detail_ar": "يمكن حذف المنشورات المعلقة فقط",
                }
            )
        return super().destroy(request, *args, **kwargs)


@method_decorator(require_flag("POST_SCHEDULER"), name="dispatch")
@extend_schema(tags=["Scheduler"])
class BroadcastMessageViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        return BroadcastMessage.objects.filter(org=self.request.org).order_by(
            "-created_at"
        )

    def get_serializer_class(self):
        if self.action == "create":
            return BroadcastMessageCreateSerializer
        return BroadcastMessageSerializer

    def create(self, request, *args, **kwargs):
        create_ser = BroadcastMessageCreateSerializer(data=request.data)
        create_ser.is_valid(raise_exception=True)
        data = create_ser.validated_data

        instance = BroadcastMessage.objects.create(
            org=request.org,
            template_name=data["template_name"],
            message_ar=data["message_ar"],
            message_en=data["message_en"],
            recipients=data["recipients"],
            scheduled_at=data.get("scheduled_at"),
        )

        from .tasks import send_broadcast

        if (
            instance.scheduled_at is None
            or instance.scheduled_at
            <= __import__("django.utils.timezone").timezone.now()
        ):
            instance.status = "SENDING"
            instance.save(update_fields=["status"])
            send_broadcast.delay(instance.id)

        return Response(
            BroadcastMessageSerializer(instance).data,
            status=status.HTTP_202_ACCEPTED,
        )
