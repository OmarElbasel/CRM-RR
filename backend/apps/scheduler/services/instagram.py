import requests
from cryptography.fernet import Fernet
from django.conf import settings


class InstagramPublishError(Exception):
    pass


def publish_post(channel, content: str, media_url: str | None) -> str:
    """Publish a post to Instagram via Content Publish API.
    Requires instagram_content_publish scope on channel token.
    Returns the published media ID."""
    fernet = Fernet(settings.FERNET_KEY)
    token = fernet.decrypt(bytes(channel.access_token)).decode()
    page_id = channel.page_id

    if not page_id:
        raise InstagramPublishError("Channel has no page_id for Instagram publishing")

    base = "https://graph.facebook.com/v17.0"

    try:
        container_resp = requests.post(
            f"{base}/{page_id}/media",
            params={"access_token": token},
            json={
                "caption": content,
                **({"image_url": media_url} if media_url else {"media_type": "REELS"}),
            },
            timeout=30,
        )
    except requests.RequestException as exc:
        raise InstagramPublishError(f"Network error creating container: {exc}") from exc

    if container_resp.status_code != 200:
        raise InstagramPublishError(
            f"Container creation failed (HTTP {container_resp.status_code}): {container_resp.text}"
        )

    container_data = container_resp.json()
    if "error" in container_data:
        raise InstagramPublishError(
            f"API error: {container_data['error'].get('message', container_data['error'])}"
        )

    container_id = container_data.get("id", "")

    try:
        publish_resp = requests.post(
            f"{base}/{page_id}/media_publish",
            params={"access_token": token, "creation_id": container_id},
            timeout=30,
        )
    except requests.RequestException as exc:
        raise InstagramPublishError(f"Network error publishing: {exc}") from exc

    if publish_resp.status_code != 200:
        raise InstagramPublishError(
            f"Publish failed (HTTP {publish_resp.status_code}): {publish_resp.text}"
        )

    publish_data = publish_resp.json()
    if "error" in publish_data:
        raise InstagramPublishError(
            f"API error: {publish_data['error'].get('message', publish_data['error'])}"
        )

    return publish_data.get("id", "")
