from django.contrib import admin

from .models import Deal, DealTask, PipelineNotification


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ['title', 'org', 'stage', 'priority', 'ai_score', 'assigned_to_name', 'created_at']
    list_filter = ['stage', 'priority', 'source_platform']
    search_fields = ['title', 'notes', 'contact__name']
    raw_id_fields = ['org', 'contact']
    readonly_fields = ['created_at', 'updated_at']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('org', 'contact')


@admin.register(DealTask)
class DealTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'org', 'deal', 'due_at', 'completed_at', 'assigned_to_name']
    list_filter = ['completed_at']
    search_fields = ['title', 'description']
    raw_id_fields = ['org', 'deal']
    readonly_fields = ['created_at', 'updated_at']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('org', 'deal')


@admin.register(PipelineNotification)
class PipelineNotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'org', 'deal', 'notification_type', 'priority', 'read_at', 'created_at']
    list_filter = ['notification_type', 'priority', 'read_at']
    search_fields = ['title', 'body', 'dedupe_key']
    raw_id_fields = ['org', 'deal']
    readonly_fields = ['created_at']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('org', 'deal')
