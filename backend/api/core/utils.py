import os
import uuid
from django.conf import settings
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
import logging
from django.template.loader import render_to_string


# Setup logging
logger = logging.getLogger(__name__)


def get_random_file_name(filename):
    # os.path.splitext() separate the file name from its extension in Python and return a tuple
    (filename, ext) = os.path.splitext(filename)
    return f"{uuid.uuid4()}{ext}"


def dynamic_exclude(model, fields_to_keep: list = [], extra_fields: list = []):
    fields_set = set({"groups", "user_permissions"})
    fields_set = fields_set.union(extra_fields)
    fields_set = fields_set.difference(fields_to_keep)
    fields_to_exclude = filter(lambda field: hasattr(model, field), fields_set)
    return tuple(fields_to_exclude)


def dynamic_admin_readonly_fields(model, fields_to_keep: list = [], extra_fields: list = []):
    fields_set = set({"id", "created", "modified"})
    fields_set = fields_set.union(extra_fields)
    fields_set = fields_set.difference(fields_to_keep)
    fields_to_mark_readonly = filter(lambda field: hasattr(model, field), fields_set)
    return tuple(fields_to_mark_readonly)


def destroy_existing_items(instance_items, to_update):
    instance_items.exclude(pk__in=to_update.keys()).delete()


def generate_random_password(
    length=10,
    allowed_chars="abcdefghjkmnpqrstuvwxyz@#&*%!)(}{ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
):
    return get_random_string(length, allowed_chars)


def generate_random_numbers(length_of_numbers):
    return get_random_string(length_of_numbers, allowed_chars="0123456789")


def render_to_string_global_context(template_name, context={}, request=None, using=None):
    """
    add general context to the template
    """
    context = {**context, **settings.GLOBAL_CONTEXT}
    return render_to_string(template_name, context, request, using)


def is_running_tests():
    return "PYTEST_CURRENT_TEST" in os.environ
