import time
import requests
from cryptography.fernet import Fernet
from django.conf import settings


class TikTokPublishError(Exception):
    pass


def publish_post(channel, content: str, media_url: str | None) -> str:
    """Publish a post to TikTok via Creator API.
    Returns the TikTok post ID. Raises TikTokPublishError on failure."""
    if not media_url:
        raise TikTokPublishError("TikTok requires a media_url (video) for publishing")

    fernet = Fernet(settings.FERNET_KEY)
    token = fernet.decrypt(bytes(channel.access_token)).decode()
    open_id = channel.tiktok_open_id

    if not open_id:
        raise TikTokPublishError("Channel has no tiktok_open_id for publishing")

    base = "https://open.tiktokapis.com/v2/post/publish"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    try:
        init_resp = requests.post(
            f"{base}/video/init/",
            headers=headers,
            json={
                "source_info": {"source": "PULL_FROM_URL", "video_url": media_url},
                "parameters": {
                    "title": content,
                    "privacy_level": "PUBLIC",
                    "disable_comment": False,
                    "disable_duet": False,
                    "disable_stitch": False,
                },
                "post_info": {"open_id": open_id},
            },
            timeout=30,
        )
    except requests.RequestException as exc:
        raise TikTokPublishError(f"Network error initializing upload: {exc}") from exc

    if init_resp.status_code != 200:
        raise TikTokPublishError(
            f"Upload init failed (HTTP {init_resp.status_code}): {init_resp.text}"
        )

    init_data = init_resp.json()
    if "error" in init_data:
        raise TikTokPublishError(
            f"TikTok API error: {init_data.get('error_description', init_data.get('error'))}"
        )

    publish_id = init_data.get("data", {}).get("publish_id", "")

    max_polls = 30
    for _ in range(max_polls):
        time.sleep(5)
        try:
            status_resp = requests.get(
                f"{base}/status/fetch/",
                headers=headers,
                params={"publish_id": publish_id},
                timeout=30,
            )
        except requests.RequestException:
            continue

        if status_resp.status_code != 200:
            continue

        status_data = status_resp.json()
        if "error" in status_data:
            raise TikTokPublishError(
                f"Publish failed: {status_data.get('error_description', status_data.get('error'))}"
            )

        task_status = status_data.get("data", {}).get("status", "")
        if task_status == "SEND_SUCCESS":
            return status_data.get("data", {}).get(
                "publicly_available_post_id", publish_id
            )
        elif task_status in ("SEND_FAILURE", "FAILED"):
            raise TikTokPublishError(f"Publish failed with status: {task_status}")

    raise TikTokPublishError("Publish timed out waiting for completion")
