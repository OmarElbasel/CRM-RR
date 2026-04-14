from django.urls import path
from .views import (
    OrderRevenueSummaryView,
    OrderCsvExportView,
    ManualOrderCreateView,
    OrderListView,
    OrderDetailView,
)

# URL ordering is CRITICAL: specific paths must come before <int:pk>
# summary/, export/, manual/ MUST be before orders/<int:pk>/
urlpatterns = [
    path('orders/summary/', OrderRevenueSummaryView.as_view(), name='order-summary'),
    path('orders/export/', OrderCsvExportView.as_view(), name='order-export'),
    path('orders/manual/', ManualOrderCreateView.as_view(), name='order-manual-create'),
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
