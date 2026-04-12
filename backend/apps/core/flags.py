"""
Feature flag utilities. Constitution Principle IV.
All flags default to False (fail-safe). Unknown flags are treated as disabled.
"""
from functools import wraps
from django.conf import settings


def is_enabled(flag_name: str) -> bool:
    """
    Return True if the named feature flag is enabled.
    Unknown flags return False (fail-safe — unknown features are disabled).
    """
    return settings.FEATURE_FLAGS.get(flag_name, False)


def require_flag(flag_name: str):
    """
    DRF view decorator. Returns HTTP 404 if the flag is disabled.
    Using 404 (not 403) makes disabled features appear non-existent to clients.

    Usage:
        @require_flag('AI_GENERATION')
        @api_view(['POST'])
        def generate_product_content(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(*args, **kwargs):
            if not is_enabled(flag_name):
                from django.http import HttpResponse
                return HttpResponse(status=404)
            return view_func(*args, **kwargs)
        return wrapper
    return decorator
