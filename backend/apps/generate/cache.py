import hashlib
import json
from django.core.cache import cache

CACHE_TTL = 86400  # 24 hours


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
    result = cache.get(key)
    if result is not None:
        return json.loads(result) if isinstance(result, str) else result
    return None


def set_cached_result(org_id: int, inputs: dict, result: dict) -> None:
    """Store ProductContentOutput dict in cache with 24h TTL."""
    key = make_cache_key(org_id, inputs)
    cache.set(key, json.dumps(result), timeout=CACHE_TTL)