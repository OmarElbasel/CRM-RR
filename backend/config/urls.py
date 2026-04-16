from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.core.urls")),
    path("api/", include("apps.orgs.urls")),
    path("api/generate/", include("apps.generate.urls")),
    path("api/auth/", include("apps.embed_auth.urls")),
    path("api/billing/", include("apps.billing.urls")),
    path("api/inbox/", include("apps.inbox.urls")),
    path("api/channels/", include("apps.inbox.channel_urls")),
    path("api/webhooks/", include("apps.inbox.webhook_urls")),
    path("api/", include("apps.pipeline.urls")),
    path("api/shopify/", include("apps.shopify.urls")),
    path("api/", include("apps.shopify.orders_urls")),
    path("api/webhooks/", include("apps.shopify.webhook_urls")),
    path("api/content/", include("apps.content.urls")),
    path("api/scheduler/", include("apps.scheduler.urls")),
    path("api/admin/", include("apps.admin_panel.urls")),
    # OpenAPI schema + docs — publicly accessible (Constitution Principle V)
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/docs/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
    ),
]
