from django.urls import path
from .views import ShopifyInstallView, ShopifyCallbackView

urlpatterns = [
    path('install/', ShopifyInstallView.as_view(), name='shopify-install'),
    path('callback/', ShopifyCallbackView.as_view(), name='shopify-callback'),
]
