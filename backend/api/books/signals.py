from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.conf import settings
from books.apps import BooksConfig
from books.post_migration import create_book_categries


@receiver(post_migrate)
def perform_post_migrate_actions(sender, **kwargs):
    if not settings.ENABLE_DB_SEEDING_AFTER_MIGRATION:
        return
    if sender.name != BooksConfig.name:
        return
    create_book_categries()
