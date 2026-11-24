"""Book store API views for managing books, authors, orders, and reviews."""
from collections import OrderedDict
from typing import Optional

import stripe
from books.filters import BookFilter
from books.models import (
    Author,
    Book,
    Cart,
    CartItem,
    Category,
    Order,
    OrderItem,
    OrderStatus,
    Review,
)
from books.serializers import (
    AuthorSerializer,
    BookSerializer,
    CartItemSerializer,
    CategorySerializer,
    OrderSerializer,
    ReviewSerializer,
)
from core.permissions import BasePermissions
from core.utils import get_object_or_none
from core.views import (
    BaseViewSet,
    NonCreatableViewSet,
    NonDeletableViewSet,
    NonListableViewSet,
    NonRetrievableViewSet,
    NonUpdatableViewSet,
)
from django.conf import settings
from django.db import transaction
from django.db.models import Avg, Count, Exists, OuterRef, QuerySet, Subquery, Value
from django.db.models.functions import Coalesce
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

stripe.api_key = settings.STRIPE_SECRET_KEY


class AuthorViewSet(BaseViewSet, NonListableViewSet, NonRetrievableViewSet):
    """ViewSet for managing author profiles.

    Supports:
    - Create: Authors create their profile (requires user account)
    - Update: Authors update their profile info (bio, website, picture)
    - Restricted: Cannot list or retrieve individual authors
    """

    model = Author
    queryset = model.objects.all()
    serializer_class = AuthorSerializer
    permission_relation = "user.pk"

    def perform_create(self, serializer) -> None:
        """Attach current user to author profile on creation.

        Args:
            serializer: Validated author serializer
        """
        serializer.save(user=self.request.user)


class BookViewSet(BaseViewSet):
    """ViewSet for managing books with rich filtering and annotations.

    Features:
    - List books with review count and average rating
    - Annotate books with user-specific data (cart, library, favorites)
    - Full CRUD operations for book authors
    """

    model = Book
    queryset = model.objects.all()
    serializer_class = BookSerializer
    filterset_class = BookFilter
    permission_relation = "author.user.pk"

    def get_queryset(self) -> QuerySet:
        """Get books with annotations for reviews and user-specific data.

        For authenticated users, includes:
        - Whether book is in their cart
        - Whether book is in their library
        - Whether book is in their favorites
        - User's review for the book (if exists)

        Returns:
            QuerySet: Annotated Book queryset
        """
        queryset = super().get_queryset()
        user = self.request.user
        queryset = queryset.annotate(
            review_count=Count("reviews"),
            average_rating=Coalesce(Avg("reviews__rating"), Value(0.0)),
        )
        if not user.is_authenticated:
            return queryset
        queryset = queryset.annotate(
            is_in_my_cart=Exists(CartItem.objects.filter(cart__user=user, book=OuterRef("id"))),
            is_in_my_library=Exists(user.library.filter(id=OuterRef("id"))),
            is_in_my_favorites=Exists(user.favorite_books.filter(id=OuterRef("id"))),
        )

        # Get user review for each book
        user_review = Review.objects.filter(book=OuterRef("pk"), user=user).values("id", "comment", "rating")
        queryset = queryset.annotate(
            my_review_id=Subquery(user_review.values("id")),
            my_review_comment=Subquery(user_review.values("comment")),
            my_review_rating=Subquery(user_review.values("rating")),
        )

        return queryset

    def perform_create(self, serializer) -> None:
        """Attach current user's author profile to book on creation.

        Args:
            serializer: Validated book serializer
        """
        serializer.save(author=self.request.user.author)


class ReviewViewSet(BaseViewSet):
    """ViewSet for managing book reviews.

    Features:
    - Create reviews with ratings and comments
    - Filter reviews by book
    - Full CRUD management
    """

    model = Review
    queryset = model.objects.all()
    serializer_class = ReviewSerializer
    permission_relation = "user.pk"

    def get_queryset(self) -> QuerySet:
        """Filter reviews by book if book_pk is provided in URL.

        Returns:
            QuerySet: Filtered reviews
        """
        queryset = super().get_queryset()
        if self.kwargs.get("book_pk"):
            return queryset.filter(book__id=self.kwargs.get("book_pk"))
        return queryset

    def perform_create(self, serializer) -> None:
        """Attach current user and book to review on creation.

        Args:
            serializer: Validated review serializer
        """
        book = get_object_or_none(Book, pk=self.kwargs.get("book_pk"))
        serializer.save(user=self.request.user, **({"book": book} if book else {}))


class OrderViewSet(BaseViewSet, NonUpdatableViewSet, NonDeletableViewSet):
    """ViewSet for managing orders.

    Features:
    - Create orders
    - List and retrieve orders
    - Cannot update or delete orders (immutable purchase records)
    """

    model = Order
    queryset = model.objects.all()
    serializer_class = OrderSerializer
    permission_relation = "user.pk"


class OrderItemViewSet(BaseViewSet, NonUpdatableViewSet, NonDeletableViewSet):
    """ViewSet for managing order items.

    Features:
    - List order items
    - Retrieve individual items
    - Cannot update or delete items (part of immutable orders)
    """

    model = Order
    queryset = model.objects.all()
    serializer_class = OrderSerializer
    permission_relation = "user.pk"


class CategoryViewSet(BaseViewSet, NonCreatableViewSet, NonUpdatableViewSet, NonDeletableViewSet):
    """ViewSet for managing book categories.

    Features:
    - List all available book categories
    - Read-only access (no create, update, or delete)
    - No pagination (small dataset)
    """

    model = Category
    queryset = model.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class CartItemViewSet(BaseViewSet):
    """ViewSet for managing shopping cart items.

    Features:
    - Add/remove books from cart
    - List cart items with total price
    - Each user has one cart (auto-created or retrieved)
    """

    model = CartItem
    queryset = model.objects.all()
    serializer_class = CartItemSerializer
    permission_relation = "cart.user.pk"

    def get_queryset(self) -> QuerySet:
        """Get cart items only for current user's cart.

        Returns:
            QuerySet: Cart items for the request user
        """
        return super().get_queryset().filter(cart=self.request.user.cart)

    def get_paginated_response(self, data) -> Response:
        """Add cart total price to pagination metadata.

        Args:
            data: Paginated cart items data

        Returns:
            Response: Paginated response with cart metadata
        """
        paginated_response = super().get_paginated_response(data)
        paginated_response.data["meta"] = OrderedDict(
            {
                "count": self.paginator.page.paginator.count,
                "total_price": self.request.user.cart.total_price,
            }
        )
        return paginated_response

    def perform_create(self, serializer) -> None:
        """Attach current user's cart to item on creation.

        Args:
            serializer: Validated cart item serializer
        """
        serializer.save(cart=self.request.user.cart)
