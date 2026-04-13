from django.contrib import admin
from .models import SocialChannel, Contact, Message


@admin.register(SocialChannel)
class SocialChannelAdmin(admin.ModelAdmin):
    list_display = ['org', 'platform', 'is_active', 'page_id', 'phone_number_id', 'connected_at']
    list_filter = ['platform', 'is_active']
    search_fields = ['org__name', 'page_id', 'phone_number_id']
    readonly_fields = ['connected_at', 'updated_at']
    ordering = ['-connected_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if hasattr(request, 'org'):
            qs = qs.filter(org=request.org)
        return qs


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'org', 'platform', 'platform_id', 'ai_score', 'created_at']
    list_filter = ['platform']
    search_fields = ['name', 'platform_id', 'org__name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-ai_score', '-created_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if hasattr(request, 'org'):
            qs = qs.filter(org=request.org)
        return qs


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['short_content', 'org', 'contact', 'platform', 'direction', 'intent', 'read', 'sent_at']
    list_filter = ['platform', 'direction', 'intent', 'read']
    search_fields = ['content', 'platform_msg_id', 'contact__name']
    readonly_fields = ['created_at']
    ordering = ['-sent_at', '-created_at']

    def short_content(self, obj):
        return obj.content[:80] if obj.content else ''
    short_content.short_description = 'Content'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if hasattr(request, 'org'):
            qs = qs.filter(org=request.org)
        return qs
