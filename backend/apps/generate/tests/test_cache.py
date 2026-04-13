import pytest

from apps.generate.cache import make_cache_key, get_cached_result, set_cached_result


@pytest.fixture(autouse=True)
def _use_locmem_cache(settings):
    settings.CACHES = {
        'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}
    }


class TestMakeCacheKey:
    def test_same_key_for_same_inputs(self):
        inputs_a = {'product_name': 'test', 'category': 'food', 'tone': 'casual'}
        inputs_b = {'tone': 'casual', 'category': 'food', 'product_name': 'test'}
        assert make_cache_key(1, inputs_a) == make_cache_key(1, inputs_b)

    def test_different_key_for_different_org(self):
        inputs = {'product_name': 'test'}
        assert make_cache_key(1, inputs) != make_cache_key(2, inputs)

    def test_different_key_for_different_inputs(self):
        assert make_cache_key(1, {'a': '1'}) != make_cache_key(1, {'a': '2'})

    def test_key_format(self):
        key = make_cache_key(1, {'x': 'y'})
        assert key.startswith('gen:')
        assert len(key) == 4 + 64  # gen: + sha256 hex


class TestCacheRoundtrip:
    def test_miss_returns_none(self):
        result = get_cached_result(999, {'nonexistent': 'data'})
        assert result is None

    def test_set_then_get(self):
        inputs = {'product_name': 'cached-product', 'lang': 'ar'}
        data = {'title': 'Test', 'short_description': 'Short'}
        set_cached_result(42, inputs, data)
        cached = get_cached_result(42, inputs)
        assert cached == data

    def test_different_org_no_cross_cache(self):
        inputs = {'product_name': 'shared'}
        data = {'title': 'Org1 result'}
        set_cached_result(1, inputs, data)
        assert get_cached_result(2, inputs) is None
