from django.shortcuts import render
from core.views import BaseViewSet
from books.models import Book, Review
from books.serializers import BookSerializer, ReviewSerializer
from books.permissions import BookPermissions


class BookViewSet(BaseViewSet):
    model = Book
    queryset = model.objects.all()
    serializer_class = BookSerializer
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
        BookPermissions,
    ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
