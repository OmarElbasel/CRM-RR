"""
Platform-level OAuth credential resolver.

Checks the DB (PlatformCredential) first, falls back to env vars.
This lets the platform operator configure credentials via the Admin Panel UI
without editing .env or restarting the server.

Usage:
    from apps.core.platform_credentials import get_credential

    app_id     = get_credential("META", "app_id")
    app_secret = get_credential("META", "app_secret")
    token      = get_credential("META", "verify_token")
"""

import json
import logging

from cryptography.fernet import Fernet
from django.conf import settings

logger = logging.getLogger(__name__)

# Maps (provider, field) → settings attribute name (env-var fallback)
_ENV_MAP: dict[tuple[str, str], str] = {
    ("META",    "app_id"):        "META_APP_ID",
    ("META",    "app_secret"):    "META_APP_SECRET",
    ("META",    "verify_token"):  "META_WEBHOOK_VERIFY_TOKEN",
    ("SHOPIFY", "app_id"):        "SHOPIFY_CLIENT_ID",
    ("SHOPIFY", "app_secret"):    "SHOPIFY_CLIENT_SECRET",
    ("SHOPIFY", "webhook_secret"):"SHOPIFY_WEBHOOK_SECRET",
    ("SHOPIFY", "api_version"):   "SHOPIFY_API_VERSION",
    ("TIKTOK",  "app_id"):        "TIKTOK_CLIENT_KEY",
    ("TIKTOK",  "app_secret"):    "TIKTOK_CLIENT_SECRET",
}


def _fernet() -> Fernet:
    return Fernet(settings.FERNET_KEY)


def _decrypt(value: bytes) -> str:
    try:
        return _fernet().decrypt(bytes(value)).decode()
    except Exception:
        logger.error("PlatformCredential: failed to decrypt secret")
        return ""


def _decrypt_json(value: bytes) -> dict:
    try:
        return json.loads(_fernet().decrypt(bytes(value)).decode())
    except Exception:
        logger.error("PlatformCredential: failed to decrypt extra JSON")
        return {}


def encrypt(value: str) -> bytes:
    """Encrypt a plaintext credential value for storage."""
    return _fernet().encrypt(value.encode())


def encrypt_json(data: dict) -> bytes:
    """Encrypt a dict as JSON for storage in the `extra` field."""
    return _fernet().encrypt(json.dumps(data).encode())


def get_credential(provider: str, field: str) -> str:
    """
    Return the credential for (provider, field).
    DB record takes priority over env vars so the admin can update without restarting.

    provider: "META" | "SHOPIFY" | "TIKTOK"
    field:    "app_id" | "app_secret" | "verify_token" | "webhook_secret" | "api_version"
    """
    # Avoid circular imports — import lazily
    try:
        from apps.admin_panel.models import PlatformCredential
        record = PlatformCredential.get(provider)
    except Exception:
        record = None

    if record:
        if field == "app_id":
            val = record.app_id or ""
            if val:
                return val
        elif field == "app_secret":
            if record.app_secret:
                return _decrypt(record.app_secret)
        else:
            # Extra fields (verify_token, webhook_secret, api_version, …)
            if record.extra:
                extras = _decrypt_json(record.extra)
                val = extras.get(field, "")
                if val:
                    return val

    # Fallback to env var
    env_key = _ENV_MAP.get((provider, field), "")
    return getattr(settings, env_key, "") or ""
