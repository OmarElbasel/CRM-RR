from django.urls import path

from .views import CaptionView, AdCopyView, BroadcastDraftView, SeasonalTemplatesView

urlpatterns = [
    path("caption/", CaptionView.as_view()),
    path("ad-copy/", AdCopyView.as_view()),
    path("whatsapp-broadcast/", BroadcastDraftView.as_view()),
    path("seasonal-templates/", SeasonalTemplatesView.as_view()),
]
