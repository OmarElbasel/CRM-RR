import logging
import time

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(name="apps.scheduler.tasks.publish_scheduled_posts", bind=True)
def publish_scheduled_posts(self):
    from apps.scheduler.models import PostSchedule
    from apps.scheduler.services import instagram, tiktok

    now = timezone.now()
    pending = PostSchedule.objects.filter(
        status="PENDING", scheduled_at__lte=now
    ).select_related("channel", "org")

    for post in pending:
        try:
            if post.platform == "INSTAGRAM":
                instagram.publish_post(
                    post.channel, post.content, post.media_url or None
                )
            else:
                tiktok.publish_post(post.channel, post.content, post.media_url or None)
            post.status = "PUBLISHED"
            post.published_at = now
        except Exception as exc:
            post.status = "FAILED"
            post.error_message = str(exc)
            logger.error("Publish failed post_id=%s: %s", post.pk, exc)
        post.save(
            update_fields=["status", "published_at", "error_message", "updated_at"]
        )

    logger.info("publish_scheduled_posts completed: processed=%d", pending.count())


@shared_task(name="apps.scheduler.tasks.send_broadcast", bind=True, max_retries=1)
def send_broadcast(self, broadcast_id: int):
    from apps.scheduler.models import BroadcastMessage
    from apps.inbox.models import SocialChannel
    from apps.inbox.services.whatsapp import WhatsAppClient

    try:
        broadcast = BroadcastMessage.objects.get(pk=broadcast_id, status="DRAFT")
    except BroadcastMessage.DoesNotExist:
        logger.error(
            "send_broadcast: broadcast_id=%s not found or not DRAFT", broadcast_id
        )
        return

    broadcast.status = "SENDING"
    broadcast.sent_at = timezone.now()
    broadcast.save(update_fields=["status", "sent_at"])

    try:
        channel = SocialChannel.objects.get(
            org=broadcast.org, platform="WHATSAPP", is_active=True
        )
    except SocialChannel.DoesNotExist:
        broadcast.status = "FAILED"
        broadcast.save(update_fields=["status"])
        return

    client = WhatsAppClient()
    BATCH_SIZE = 80
    recipients = broadcast.recipients

    for i in range(0, len(recipients), BATCH_SIZE):
        batch = recipients[i : i + BATCH_SIZE]
        for phone in batch:
            try:
                client.send_message(
                    channel.phone_number_id, to=phone, content=broadcast.message_en
                )
                broadcast.sent_count += 1
            except Exception:
                broadcast.failed_count += 1
        broadcast.save(update_fields=["sent_count", "failed_count"])
        if i + BATCH_SIZE < len(recipients):
            time.sleep(1)

    broadcast.status = "SENT" if broadcast.failed_count < len(recipients) else "FAILED"
    broadcast.save(update_fields=["status"])
    logger.info(
        "send_broadcast completed: broadcast_id=%s sent=%d failed=%d",
        broadcast_id,
        broadcast.sent_count,
        broadcast.failed_count,
    )
