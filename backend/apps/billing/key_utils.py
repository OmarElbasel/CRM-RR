"""
API key generation and Fernet encryption utilities.
Constitution Security Requirements: secret keys encrypted at rest, never in API responses.
"""
import secrets
from cryptography.fernet import Fernet
from django.conf import settings


def _get_fernet() -> Fernet:
    """Return a Fernet instance using FERNET_KEY from settings."""
    if not settings.FERNET_KEY:
        raise RuntimeError(
            'FERNET_KEY is not configured. '
            'Generate one with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"'
        )
    return Fernet(settings.FERNET_KEY)


def generate_key_pair() -> tuple[str, str, bytes]:
    """
    Generate a new public/secret API key pair.
    Returns: (public_key, secret_key_plaintext, secret_key_encrypted)
    - public_key: safe to store and display (pk_live_xxx)
    - secret_key_plaintext: shown to user ONCE only, never stored plain
    - secret_key_encrypted: store this in Organization.api_key_secret (BinaryField)
    """
    public_key = f'pk_live_{secrets.token_hex(24)}'
    secret_plaintext = f'sk_live_{secrets.token_hex(32)}'
    fernet = _get_fernet()
    secret_encrypted = fernet.encrypt(secret_plaintext.encode())
    return public_key, secret_plaintext, secret_encrypted


def decrypt_secret_key(encrypted: bytes) -> str:
    """Decrypt and return the plaintext secret key. Used only for the reveal flow."""
    fernet = _get_fernet()
    return fernet.decrypt(encrypted).decode()
