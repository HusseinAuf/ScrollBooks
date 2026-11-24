from django.urls import include, path

urlpatterns = [
    path("v1/users/", include(("users.api.v1.urls", "users"), namespace="v1")),
]
