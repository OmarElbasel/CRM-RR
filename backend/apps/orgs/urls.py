from django.urls import path
from . import views

urlpatterns = [
    path('org/me/', views.org_me, name='org-me'),
]
