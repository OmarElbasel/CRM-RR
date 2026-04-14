from django.urls import path
from .views import ShopifyWebhookView

urlpatterns = [
    path('shopify/', ShopifyWebhookView.as_view(), name='shopify-webhook'),
]
