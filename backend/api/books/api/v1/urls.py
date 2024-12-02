from django.urls import path
from django.urls import include
from rest_framework_nested.routers import DefaultRouter, NestedSimpleRouter
from books.views import BookViewSet, ReviewViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"categories", CategoryViewSet, basename="category")

book_router = NestedSimpleRouter(router, r"books", lookup="book")
book_router.register(r"reviews", ReviewViewSet, basename="review")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(book_router.urls)),
]
