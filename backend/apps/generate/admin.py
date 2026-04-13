from django.contrib import admin
from .models import AIUsage


@admin.register(AIUsage)
class AIUsageAdmin(admin.ModelAdmin):
    list_display = ['org', 'model', 'language', 'tokens_in', 'tokens_out', 'cost_usd', 'cache_hit', 'success', 'created_at']
    list_filter = ['org', 'language', 'tone', 'success', 'cache_hit']
    date_hierarchy = 'created_at'
    readonly_fields = ['org', 'model', 'tokens_in', 'tokens_out', 'cost_usd', 'created_at']
    ordering = ['-created_at']