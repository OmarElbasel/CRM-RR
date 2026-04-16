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

    Works on both function-based views and class-based views (APIView subclasses).

    Usage (FBV):
        @require_flag('AI_GENERATION')
        @api_view(['POST'])
        def generate_product_content(request):
            ...

    Usage (CBV):
        @require_flag('TIKTOK_INBOX')
        class MyView(APIView):
            ...
    """
    import inspect

    def decorator(view):
        if inspect.isclass(view):
            # Class-based view: subclass it and gate dispatch()
            original_dispatch = view.dispatch

            def gated_dispatch(self, request, *args, **kwargs):
                if not is_enabled(flag_name):
                    from django.http import HttpResponse
                    return HttpResponse(status=404)
                return original_dispatch(self, request, *args, **kwargs)

            view.dispatch = gated_dispatch
            return view
        else:
            # Function-based view
            @wraps(view)
            def wrapper(*args, **kwargs):
                if not is_enabled(flag_name):
                    from django.http import HttpResponse
                    return HttpResponse(status=404)
                return view(*args, **kwargs)
            return wrapper
    return decorator
