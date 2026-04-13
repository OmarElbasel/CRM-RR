from django.urls import path
from . import views

urlpatterns = [
    path('org/', views.org_me, name='org-me'),
    path('org/update/', views.org_update, name='org-update'),
    path('org/usage/', views.org_usage, name='org-usage'),
    path('org/rotate-key/', views.rotate_key, name='org-rotate-key'),
]
