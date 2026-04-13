from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout/', views.CreateCheckoutView.as_view(), name='billing-create-checkout'),
    path('webhook/', views.StripeWebhookView.as_view(), name='billing-webhook'),
]
