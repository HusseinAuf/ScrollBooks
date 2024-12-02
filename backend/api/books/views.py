from django.shortcuts import render
from core.views import BaseViewSet, NonCreatableViewSet, NonDeletableViewSet, NonUpdatableViewSet
from books.models import Author, Book, Review, Category
from books.serializers import AuthorSerializer, BookSerializer, ReviewSerializer, CategorySerializer
from books.permissions import AuthorPermissions, BookPermissions, ReviewPermissions
from core.permissions import BasePermissions
from books.filters import BookFilter


class AuthorViewSet(BaseViewSet):
    model = Author
    queryset = model.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [
        AuthorPermissions,
    ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookViewSet(BaseViewSet):
    model = Book
    queryset = model.objects.all()
    serializer_class = BookSerializer
    filterset_class = BookFilter
    permission_classes = [
        BookPermissions,
    ]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.author)


class ReviewViewSet(BaseViewSet):
    model = Review
    queryset = model.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [
        ReviewPermissions,
    ]

    def perform_create(self, serializer):
        print(self.request.user)
        serializer.save(user=self.request.user)


class CategoryViewSet(BaseViewSet, NonCreatableViewSet, NonUpdatableViewSet, NonDeletableViewSet):
    model = Category
    queryset = model.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None
