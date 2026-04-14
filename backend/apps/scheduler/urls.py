from rest_framework.routers import DefaultRouter

from .views import PostScheduleViewSet, BroadcastMessageViewSet

router = DefaultRouter()
router.register("posts", PostScheduleViewSet, basename="post-schedule")
router.register("broadcasts", BroadcastMessageViewSet, basename="broadcast")

urlpatterns = router.urls
