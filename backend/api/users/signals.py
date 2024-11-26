from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.conf import settings
from users.apps import UsersConfig
from django.core.exceptions import MultipleObjectsReturned
from users.post_migration import create_superuser
from users.emails import send_verification_email
from users.models import User
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator


@receiver(post_migrate)
def perform_post_migrate_actions(sender, **kwargs):
    if not settings.ENABLE_DB_SEEDING_AFTER_MIGRATION:
        return
    if sender.name != UsersConfig.name:
        return
    create_superuser()


@receiver(post_save, sender=User)
def handle_verification_email(sender, instance, created, **kwargs):
    if created and not instance.is_active:
        uid = urlsafe_base64_encode(force_bytes(instance.pk))
        token = PasswordResetTokenGenerator().make_token(instance)
        send_verification_email(instance, uid, token)
