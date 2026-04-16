from django.urls import path
from .views import ShopifyInstallView, ShopifyCallbackView, ShopifyDirectConnectView, ShopifySyncView

urlpatterns = [
    path('install/', ShopifyInstallView.as_view(), name='shopify-install'),
    path('callback/', ShopifyCallbackView.as_view(), name='shopify-callback'),
    path('connect-direct/', ShopifyDirectConnectView.as_view(), name='shopify-connect-direct'),
    path('sync/', ShopifySyncView.as_view(), name='shopify-sync'),
]
