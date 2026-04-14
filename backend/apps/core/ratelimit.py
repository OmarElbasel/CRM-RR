"""
Per-org rate limit key function for django-ratelimit.
Scopes limits to the authenticated Organization rather than IP or user.
Constitution Principle I — rate limits isolate orgs from each other.
"""
from django.http import JsonResponse


def org_key(group, request):
    """
    Return the rate-limit cache key for this request.
    Uses org primary key so each org has its own independent limit.
    Falls back to IP for unauthenticated requests.
    """
    if hasattr(request, 'org') and request.org:
        return str(request.org.pk)
    return request.META.get('REMOTE_ADDR', 'anon')


def rate_limited_response() -> JsonResponse:
    """Bilingual JSON 429 response returned when rate limit is exceeded."""
    return JsonResponse(
        {
            'error': 'Too many requests. Please slow down.',
            'error_ar': 'طلبات كثيرة جداً. يرجى الإبطاء.',
            'code': 'RATE_LIMITED',
        },
        status=429,
    )
