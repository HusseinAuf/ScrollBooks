from django.urls import path
from django.urls import include


urlpatterns = [
    path("v1/users/", include("users.api.v1.urls"), name="users-api-v1"),
]
