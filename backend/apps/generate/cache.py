import hashlib
import json
import logging
from django.core.cache import cache

logger = logging.getLogger(__name__)
CACHE_TTL = 86400  # 24 hours


def _is_cache_error(exc: BaseException) -> bool:
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


def safe_cache_get(key: str, default=None):
    """cache.get() that returns default instead of crashing when Redis is down."""
    try:
        return cache.get(key, default)
    except Exception as exc:
        if _is_cache_error(exc):
            logger.warning("Cache GET unavailable for key=%s — skipping", key)
            return default
        raise


def safe_cache_set(key: str, value, timeout=None) -> None:
    """cache.set() that silently skips when Redis is down."""
    try:
        cache.set(key, value, timeout=timeout)
    except Exception as exc:
        if _is_cache_error(exc):
            logger.warning("Cache SET unavailable for key=%s — skipping", key)
            return
        raise


def make_cache_key(org_id: int, inputs: dict) -> str:
    """
    Deterministic cache key from org ID + sorted input params.
    Key format: gen:{sha256_hex}
    Reference: research.md Decision 3.
    """
    canonical = json.dumps({'org_id': org_id, **inputs}, sort_keys=True)
    return 'gen:' + hashlib.sha256(canonical.encode()).hexdigest()


def get_cached_result(org_id: int, inputs: dict) -> dict | None:
    """Return cached ProductContentOutput dict or None."""
    key = make_cache_key(org_id, inputs)
    result = safe_cache_get(key)
    if result is not None:
        return json.loads(result) if isinstance(result, str) else result
    return None


def set_cached_result(org_id: int, inputs: dict, result: dict) -> None:
    """Store ProductContentOutput dict in cache with 24h TTL."""
    key = make_cache_key(org_id, inputs)
    safe_cache_set(key, json.dumps(result), timeout=CACHE_TTL)