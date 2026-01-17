from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import (
    UserViewSet,
    LoginView,
    GoogleAuthView,
    LogoutView,
    PasswordResetView,
    PasswordResetConfirmView,
    TokenRefreshView,
    VerifyEmail,
    ResendVerificationEmail,
)
from users.apps import UsersConfig


router = DefaultRouter()
router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("login/", LoginView.as_view(), name="login"),
    path("google-auth/", GoogleAuthView.as_view(), name="google-auth"),
    path(
        "verify-email/<slug:uidb64>/<slug:token>/",
        VerifyEmail.as_view(),
        name="verify-email",
    ),
    path(
        "resend-verification-email/",
        ResendVerificationEmail.as_view(),
        name="resend-verification-email",
    ),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("password/reset/", PasswordResetView.as_view(), name="password-reset"),
    path(
        "password/reset/confirm/<slug:uidb64>/<slug:token>/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
]
