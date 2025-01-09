from django_filters.rest_framework import filters, FilterSet
from django.utils.translation import gettext_lazy as _
from books.models import Book


class BookFilter(FilterSet):
    search = filters.CharFilter(method="search_filter", label="Search")
    library = filters.BooleanFilter(method="library_filter", label="Library")  # Books the user library
    favorite = filters.BooleanFilter(method="favorite_filter", label="Favorite")  # favorite books of the user

    class Meta:
        model = Book
        fields = {
            "author__user": ["exact"],
        }

    def search_filter(self, queryset, name, value):
        if value:
            return queryset.filter(title__icontains=value)
        return queryset

    def library_filter(self, queryset, name, value):
        if value:
            return queryset.filter(users_with_library=self.request.user)
        return queryset

    def favorite_filter(self, queryset, name, value):
        if value:
            return queryset.filter(favorited_by=self.request.user)
        return queryset
