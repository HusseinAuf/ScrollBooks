from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel
from django_ulid.models import ULIDField, default as default_ulid
import ulid
from django.db import models


def new_ulid():
    return str(default_ulid())


class BaseModel(TimeStampedModel):
    id = ULIDField(primary_key=True, editable=False, default=new_ulid)

    class Meta:
        abstract = True  # This model won't create a table in the database.
