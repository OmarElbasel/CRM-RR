"""
Per-org rate limit key function for django-ratelimit.
Scopes limits to the authenticated Organization rather than IP or user.
Constitution Principle I — rate limits isolate orgs from each other.
"""
import logging
from functools import wraps

from django.http import JsonResponse

logger = logging.getLogger(__name__)


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


def _is_cache_connection_error(exc: BaseException) -> bool:
    """Return True if the exception is a Redis/cache connection failure."""
    try:
        from django_redis.exceptions import ConnectionInterrupted
        if isinstance(exc, ConnectionInterrupted):
            return True
    except ImportError:
        pass
    try:
        from redis.exceptions import ConnectionError as RedisConnectionError
        if isinstance(exc, RedisConnectionError):
            return True
    except ImportError:
        pass
    return False


def safe_ratelimit(key, rate, method='ALL', block=False):
    """
    Drop-in replacement for django_ratelimit.decorators.ratelimit that fails
    open when the cache backend (Redis) is unavailable.  This prevents 500
    errors in dev/staging environments where Redis is not running while still
    enforcing limits when Redis is healthy.

    Usage is identical to the original decorator:
        @method_decorator(safe_ratelimit(key=org_key, rate='10/m', method='POST', block=False), name='dispatch')
    """
    from django_ratelimit.decorators import ratelimit as _ratelimit

    _dec = _ratelimit(key=key, rate=rate, method=method, block=block)

    def decorator(func):
        wrapped = _dec(func)

        @wraps(func)
        def inner(*args, **kwargs):
            try:
                return wrapped(*args, **kwargs)
            except Exception as exc:
                if _is_cache_connection_error(exc):
                    logger.warning(
                        "Rate limiter cache unavailable — failing open for %s",
                        getattr(func, '__name__', repr(func)),
                    )
                    return func(*args, **kwargs)
                raise

        return inner

    return decorator
