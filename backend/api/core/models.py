from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel


class BaseModel(TimeStampedModel):
    class Meta:
        abstract = True  # This model won't create a table in the database.
