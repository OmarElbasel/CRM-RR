from django.urls import path

from . import views

urlpatterns = [
    path('pipeline/', views.PipelineBoardView.as_view(), name='pipeline-board'),
    path('deals/', views.DealCreateView.as_view(), name='deal-create'),
    path('deals/<int:deal_id>/', views.DealDetailView.as_view(), name='deal-detail'),
    path('deals/<int:deal_id>/tasks/', views.DealTaskCreateView.as_view(), name='deal-task-create'),
    path('tasks/<int:task_id>/', views.DealTaskUpdateView.as_view(), name='deal-task-update'),
    path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
]
