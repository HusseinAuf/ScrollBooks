from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter
from books.views import BookViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")
router.register(r"reviews", ReviewViewSet, basename="review")

urlpatterns = [
    path("", include(router.urls)),
]
