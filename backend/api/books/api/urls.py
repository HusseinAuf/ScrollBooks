from django.urls import include, path

urlpatterns = [
    path("v1/books/", include(("books.api.v1.urls", "books"), namespace="v1")),
]
