from django.urls import path

from . import views

app_name = 'embed_auth'

urlpatterns = [
    path('validate-public-key/', views.ValidatePublicKeyView.as_view(), name='validate-public-key'),
]
