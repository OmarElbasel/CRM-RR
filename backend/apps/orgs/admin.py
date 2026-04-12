from django.contrib import admin
from .models import Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'clerk_org_id', 'plan', 'is_active', 'created_at']
    list_filter = ['plan', 'is_active']
    search_fields = ['name', 'clerk_org_id']
    # clerk_org_id and timestamps are managed by Clerk/system — not user-editable
    readonly_fields = ['clerk_org_id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    fieldsets = [
        ('Identity', {
            'fields': ['name', 'clerk_org_id'],
        }),
        ('Plan & Status', {
            'fields': ['plan', 'is_active'],
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse'],
        }),
    ]
