from django_filters.rest_framework import filters, FilterSet
from django.db.models import Q, F
from django.utils.translation import gettext_lazy as _
from rest_framework.serializers import ValidationError
from users.models import User


class UserFilter(FilterSet):
    is_author = filters.BooleanFilter(method="is_author_filter", label="Is Author")
    search = filters.CharFilter(method="search_filter", label="Search")

    class Meta:
        model = User
        fields = {}

    def is_author_filter(self, queryset, name, value):
        if not value:
            return queryset.filter(author__isnull=True)
        return queryset.filter(author__isnull=False)

    def search_filter(self, queryset, name, value: str):
        if not value:
            return queryset
        return queryset.filter(Q(email__icontains=value) | Q(name__icontains=value))
