from django.urls import path

from .views import ConnectView, CallbackView, ChannelListView, DisconnectView, MetaManualConnectView, ChannelStatsView
from .tiktok_oauth_views import TikTokConnectView, TikTokCallbackView

app_name = "channels"

urlpatterns = [
    path("", ChannelListView.as_view(), name="channel-list"),
    # Specific routes must come before the generic <str:platform> catch-all
    path("connect/tiktok/", TikTokConnectView.as_view(), name="tiktok-connect"),
    path("connect-meta-manual/", MetaManualConnectView.as_view(), name="meta-manual-connect"),
    path("connect/<str:platform>/", ConnectView.as_view(), name="channel-connect"),
    path("callback/meta/", CallbackView.as_view(), name="channel-callback"),
    path("callback/tiktok/", TikTokCallbackView.as_view(), name="tiktok-callback"),
    path("disconnect/", DisconnectView.as_view(), name="channel-disconnect"),
    path("stats/", ChannelStatsView.as_view(), name="channel-stats"),
]
