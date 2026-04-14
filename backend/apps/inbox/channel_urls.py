from django.urls import path

from .views import ConnectView, CallbackView, ChannelListView, DisconnectView
from .tiktok_oauth_views import TikTokConnectView, TikTokCallbackView

app_name = "channels"

urlpatterns = [
    path("", ChannelListView.as_view(), name="channel-list"),
    path("connect/<str:platform>/", ConnectView.as_view(), name="channel-connect"),
    path("callback/meta/", CallbackView.as_view(), name="channel-callback"),
    path("connect/tiktok/", TikTokConnectView.as_view(), name="tiktok-connect"),
    path("callback/tiktok/", TikTokCallbackView.as_view(), name="tiktok-callback"),
    path("disconnect/", DisconnectView.as_view(), name="channel-disconnect"),
]
