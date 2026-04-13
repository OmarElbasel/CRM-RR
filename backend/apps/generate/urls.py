from django.urls import path
from . import views

app_name = 'generate'

urlpatterns = [
    path('product-content/', views.GenerateProductContentView.as_view(), name='product-content'),
    path('stream/', views.StreamGenerateView.as_view(), name='stream'),
]