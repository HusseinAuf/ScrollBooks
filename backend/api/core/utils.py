import os
import uuid
import random
import io
import csv

# import qrcode
from django.http import QueryDict
from django.utils.datastructures import MultiValueDict
from django.http import HttpResponse
from django.conf import settings
from django.core.signing import Signer
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.response import Response
from rest_framework.utils import html
import logging

# from iam.encryption import RSAEncryptor
# from weasyprint import HTML
from django.template.loader import get_template
from django.template.loader import render_to_string


# Setup logging
logger = logging.getLogger(__name__)


def get_random_file_name(filename):
    # os.path.splitext() separate the file name from its extension in Python and return a tuple
    (filename, ext) = os.path.splitext(filename)
    return f"{uuid.uuid4()}{ext}"


def remove_nested_serializer_field(validated_data: dict, field_name: str, default=[]):
    # Removing "field_name" from validated_data to avoid error in super().create() or super().update()
    return validated_data.pop(field_name, default)


def querydict_get_list(data, field_name, default=[]):
    if not isinstance(data, QueryDict):
        field = data.get(field_name, default)
        field = [field] if not isinstance(field, list) else field
        return field
    return data.getlist(field_name, default=default)


def querydict_data_to_dict(data):
    # For Handling QueryDict data that comes from form-data format
    if not isinstance(data, (QueryDict, MultiValueDict)):
        return data
    converted_data = dict()
    for key in data.keys():
        converted_data[key] = data.getlist(key)
        if len(converted_data[key]) == 0:
            converted_data[key] = None
        if len(converted_data[key]) == 1:
            converted_data[key] = converted_data[key][0]
    return converted_data


def get_list_value_from_querydict_data(dictionary, field_name):
    if html.is_html_input(dictionary):
        data = html.parse_html_list(dictionary, prefix=field_name, default=[])
        return [item.dict() for item in data if isinstance(item, MultiValueDict) or item]
    return dictionary.get(field_name, [])


def get_dict_value_from_querydict_data(dictionary, field_name):
    if html.is_html_input(dictionary):
        return html.parse_html_dict(dictionary, prefix=field_name) or {}
    return dictionary.get(field_name, {})


def serializer_save(serializer_class, **kwargs):
    serializer = serializer_class(**kwargs)
    serializer.is_valid(raise_exception=True)
    instance = serializer.save()
    return instance, serializer


def get_serialized_data(serializer_class, instance, **kwargs):
    return serializer_class(instance, **kwargs).data if instance else None


def dynamic_exclude(model, fields_to_keep: list = [], extra_fields: list = []):
    fields_set = set({"created_at", "updated_at", "created_by", "updated_by", "company", "groups", "user_permissions"})
    fields_set = fields_set.union(extra_fields)
    fields_set = fields_set.difference(fields_to_keep)
    fields_to_exclude = filter(lambda field: hasattr(model, field), fields_set)
    return tuple(fields_to_exclude)


def dynamic_admin_readonly_fields(model, fields_to_keep: list = [], extra_fields: list = []):
    fields_set = set({"id", "created_at", "updated_at", "created_by", "updated_by"})
    fields_set = fields_set.union(extra_fields)
    fields_set = fields_set.difference(fields_to_keep)
    fields_to_mark_readonly = filter(lambda field: hasattr(model, field), fields_set)
    return tuple(fields_to_mark_readonly)


def organize_create_update_data(items):
    to_create = list()
    to_update = dict()

    items = [items] if not isinstance(items, list) else items
    for item in items:
        if "id" in item:
            item_key = str(item["id"])
            to_update[item_key] = item
        else:
            to_create.append(item) if item else None

    return to_create, to_update


def update_existing_items(instance_items, to_update, serializer_class, **kwargs):
    for instance_item in instance_items:
        item_key = str(instance_item.pk)
        if item_key in to_update:
            serializer_save(serializer_class, instance=instance_item, data=to_update[item_key], **kwargs)


def destroy_existing_items(instance_items, to_update):
    instance_items.exclude(pk__in=to_update.keys()).delete()


def get_signed_token(pk):
    signer = Signer()
    random_number = random.randint(1000, 9999)
    data_to_sign = {"pk": pk, "random_number": random_number}
    return signer.sign_object(data_to_sign)


def unsign_token(token, kwargs):
    try:
        signer = Signer()
        unsigned_data = signer.unsign_object(token)
        kwargs["pk"] = unsigned_data["pk"]
        return unsigned_data
    except Exception:
        return Response({"detail": _("Invalid token")}, status=status.HTTP_400_BAD_REQUEST)


def generate_random_password(
    length=10, allowed_chars="abcdefghjkmnpqrstuvwxyz@#&*%!)(}{ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
):
    return get_random_string(length, allowed_chars)


def generate_random_letters(length_of_letters, allowed_chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
    return get_random_string(length_of_letters, allowed_chars=allowed_chars)


def generate_random_numbers(length_of_numbers):
    return get_random_string(length_of_numbers, allowed_chars="0123456789")


def readcsv(myfile):
    file = myfile.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(file))
    data = [line for line in reader]
    return data


def output(existing_csv_data, error_dict):
    for row_number, value in error_dict.items():
        if row_number < len(existing_csv_data):
            existing_csv_data[row_number]["Error"] = value
    new_csv_filename = "output.csv"
    with open(new_csv_filename, "w", newline="") as new_csv_file:
        fieldnames = existing_csv_data[0].keys()
        writer = csv.DictWriter(new_csv_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(existing_csv_data)
    response = HttpResponse(new_csv_filename, content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{new_csv_filename}"'
    return response


class Tracker:
    def __init__(self, instance, old_values) -> None:
        self.instance = instance
        self.old_values = old_values

    def has_changed(self, field):
        if field not in self.old_values:
            return False
        return self.old_values.get(field) != getattr(self.instance, field)


# def decrypt_financial_info(encrypted_data: str) -> str:
#     try:
#         encryptor = RSAEncryptor(settings.PUBLIC_KEY_PATH, settings.PRIVATE_KEY_PATH)
#         return encryptor.decrypt(encrypted_data)
#     except Exception as e:
#         logger.error(f"Error decrypting financial info: {e}")
#         raise


def render_template(template_src, context_dict):
    template = get_template(template_src)
    html = template.render(context_dict)
    return html


# def html_to_pdf(html, request):
#     return HTML(string=html, base_url=request.build_absolute_uri()).write_pdf(presentational_hints=True)


# def render_to_pdf(request, template_src, context_dict):
#     html = render_template(template_src, context_dict)
#     return html_to_pdf(html, request)


def render_to_string_global_context(template_name, context=None, request=None, using=None):
    """
    add general context to the template
    """
    if not context:
        context = {}
    context = {**context, **settings.GLOBAL_CONTEXT}
    return render_to_string(template_name, context, request, using)
