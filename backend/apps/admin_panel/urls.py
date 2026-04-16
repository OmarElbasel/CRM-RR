from django.urls import path
from . import views

urlpatterns = [
    path('overview/', views.AdminOverviewView.as_view(), name='admin-overview'),
    path('orgs/', views.AdminOrgListView.as_view(), name='admin-org-list'),
    path('orgs/<int:id>/', views.AdminOrgDetailView.as_view(), name='admin-org-detail'),
    path('orgs/<int:id>/plan/', views.AdminOrgPlanView.as_view(), name='admin-org-plan'),
    path('orgs/<int:id>/reset-usage/', views.AdminOrgResetUsageView.as_view(), name='admin-org-reset-usage'),
    path('orgs/<int:id>/suspend/', views.AdminOrgSuspendView.as_view(), name='admin-org-suspend'),
    path('orgs/<int:id>/rotate-keys/', views.AdminOrgRotateKeysView.as_view(), name='admin-org-rotate-keys'),
    path('orgs/<int:id>/extend-limit/', views.AdminOrgExtendLimitView.as_view(), name='admin-org-extend-limit'),
    path('ai-usage/', views.AdminAIUsageView.as_view(), name='admin-ai-usage'),
    path('config/', views.AdminConfigView.as_view(), name='admin-config'),
    path('config/token-budgets/', views.AdminConfigTokenBudgetsView.as_view(), name='admin-config-token-budgets'),
    path('config/cost-rates/', views.AdminConfigCostRatesView.as_view(), name='admin-config-cost-rates'),
    path('rate-limits/', views.AdminRateLimitsView.as_view(), name='admin-rate-limits'),
    path('platform-credentials/', views.AdminPlatformCredentialsView.as_view(), name='admin-platform-credentials'),
    path('platform-credentials/<str:provider>/', views.AdminPlatformCredentialDetailView.as_view(), name='admin-platform-credential-detail'),
]
