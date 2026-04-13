from django.urls import path

from .views import WebhookView

app_name = 'webhooks'

urlpatterns = [
    path('meta/', WebhookView.as_view(), name='meta-webhook'),
]
