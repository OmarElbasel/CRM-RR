from django.contrib import admin
from .models import AdminConfig, RateLimitEvent

@admin.register(AdminConfig)
class AdminConfigAdmin(admin.ModelAdmin):
    """Singleton admin for AdminConfig."""
    list_display = ("__str__", "updated_at", "updated_by")
    
    def has_add_permission(self, request):
        # Only allow one instance
        if self.model.objects.count() >= 1:
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(RateLimitEvent)
class RateLimitEventAdmin(admin.ModelAdmin):
    """Read-only admin for RateLimitEvent."""
    list_display = ("org", "reason", "created_at")
    list_filter = ("reason", "created_at")
    search_fields = ("org__name", "org__clerk_org_id")
    readonly_fields = ("org", "reason", "created_at")
    date_hierarchy = "created_at"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
