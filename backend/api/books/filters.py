from django_filters.rest_framework import filters, FilterSet
from django.utils.translation import gettext_lazy as _
from books.models import Book


class BookFilter(FilterSet):
    search = filters.CharFilter(method="search_filter", label="Search")

    class Meta:
        model = Book
        fields = {
            "author__user": ["exact"],
        }

    def search_filter(self, queryset, name, value: str):
        if not value:
            return queryset
        return queryset.filter(title__icontains=value)
