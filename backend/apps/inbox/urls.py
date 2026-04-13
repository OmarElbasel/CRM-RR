from django.urls import path

from .views import (
    InboxListView,
    ThreadView,
    ReplyView,
    ReadView,
    UnreadView,
    SSEStreamView,
)

app_name = 'inbox'

urlpatterns = [
    path('', InboxListView.as_view(), name='inbox-list'),
    path('<int:contact_id>/messages/', ThreadView.as_view(), name='thread'),
    path('messages/<int:message_id>/reply/', ReplyView.as_view(), name='reply'),
    path('messages/<int:message_id>/read/', ReadView.as_view(), name='read'),
    path('messages/<int:message_id>/unread/', UnreadView.as_view(), name='unread'),
    path('stream/', SSEStreamView.as_view(), name='stream'),
]
