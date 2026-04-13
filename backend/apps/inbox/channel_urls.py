from django.urls import path

from .views import ConnectView, CallbackView, ChannelListView, DisconnectView

app_name = 'channels'

urlpatterns = [
    path('', ChannelListView.as_view(), name='channel-list'),
    path('connect/<str:platform>/', ConnectView.as_view(), name='channel-connect'),
    path('callback/meta/', CallbackView.as_view(), name='channel-callback'),
    path('disconnect/', DisconnectView.as_view(), name='channel-disconnect'),
]
