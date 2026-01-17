from django.urls import include
from django.urls import path
from users.apps import UsersConfig


urlpatterns = [
    path("api/", include("users.api.urls")),
]
