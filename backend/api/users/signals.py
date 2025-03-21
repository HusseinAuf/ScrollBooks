from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.conf import settings
from users.apps import UsersConfig
from django.core.exceptions import MultipleObjectsReturned
from users.post_migration import create_superuser
from users.emails import send_verification_email
from users.models import User
from books.models import Cart
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from users.utils import generate_uid_and_token


@receiver(post_migrate)
def perform_post_migrate_actions(sender, **kwargs):
    if not settings.ENABLE_DB_SEEDING_AFTER_MIGRATION:
        return
    if sender.name != UsersConfig.name:
        return
    create_superuser()


@receiver(post_save, sender=User)
def perform_post_save_user(sender, instance, created, **kwargs):
    # send verification email
    if created and not instance.is_verified:
        uid, token = generate_uid_and_token(instance)
        send_verification_email(instance, uid, token)

    # create cart
    if created and (not hasattr(instance, "cart") or instance.cart is None):
        Cart.objects.create(user=instance)
