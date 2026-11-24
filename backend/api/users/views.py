from datetime import datetime
from typing import Optional

import requests
from books.models import Book
from books.serializers import BookSerializer
from core.renderers import BaseJSONRenderer
from core.views import (
    BaseViewSet,
    NonDeletableViewSet,
    NonListableViewSet,
    NonRetrievableViewSet,
)
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.renderers import BrowsableAPIRenderer
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView as JwtTokenRefreshView
from users.authentication import set_jwt_cookies, unset_jwt_cookies
from users.emails import send_reset_password_email, send_verification_email
from users.filters import UserFilter
from users.models import User
from users.permissions import UserPermissions
from users.serializers import (
    GoogleAuthSerializer,
    PasswordResetConfirmSerializer,
    SendEmailSerializer,
    UserSerializer,
)
from users.services.google_auth import GoogleAuthService
from users.utils import (
    generate_tokens_for_user,
    generate_uid_and_token,
    validate_onetime_token_and_get_user,
)


class UserViewSet(BaseViewSet, NonDeletableViewSet, NonListableViewSet, NonRetrievableViewSet):
    """ViewSet for managing user profiles and operations.

    Supports:
    - Create: Register new user account
    - Update: Modify user profile (email, name, phone, favorite books, library)
    - Custom endpoints: /me/ (get current user), book favorites/library management
    """

    model = User
    queryset = model.objects.all()
    serializer_class = UserSerializer
    filterset_class = UserFilter
    permission_classes = [UserPermissions]
    permission_relation = "pk"

    def get_queryset(self):
        """Filter users: return current user or any public author profiles.

        Returns:
            QuerySet: Filtered users based on request user and author status
        """
        return super().get_queryset().filter(Q(id=self.request.user.id) | Q(author__isnull=False))

    def create(self, request: Request, *args, **kwargs) -> Response:
        """Register a new user account.

        Args:
            request: HTTP request with user registration data

        Returns:
            Response: Created user data with status 201
        """
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_name="me", url_path="me")
    def me(self, request: Request) -> Response:
        """Get current authenticated user's profile.

        Args:
            request: HTTP request

        Returns:
            Response: Current user's serialized data
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=200)


class BaseUserGenericAPIView(generics.GenericAPIView):
    """Base generic view for user-related API endpoints.

    Configuration:
    - All endpoints allow any access (AllowAny permissions)
    - No authentication required
    - Custom JSON renderers
    """

    renderer_classes = [BaseJSONRenderer, BrowsableAPIRenderer]
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        """Get all users from the database.

        Returns:
            QuerySet: All User objects
        """
        return User.objects.all()


class LoginView(TokenObtainPairView, BaseUserGenericAPIView):
    """Handle user login and JWT token generation.

    Returns JWT tokens in both response data and HTTP-only cookies.
    """

    def post(self, request: Request, *args, **kwargs) -> Response:
        """Authenticate user and return JWT tokens.

        Args:
            request: HTTP request with email and password

        Returns:
            Response: Access and refresh tokens, set in cookies
        """
        response = super().post(request, *args, **kwargs)
        response.data["access_token"] = response.data["access"]
        set_jwt_cookies(response, response.data.pop("access"), response.data.pop("refresh"))
        return response


class GoogleAuthView(BaseUserGenericAPIView):
    """Handle Google OAuth2 authentication (login and signup).

    Exchanges Google authorization code for tokens, validates user info,
    and creates or retrieves user account.
    """

    serializer_class = GoogleAuthSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        """Handle both Google login and signup.

        Args:
            request: HTTP request with Google authorization code

        Returns:
            Response: User data, access token, and creation status
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        google_code = serializer.validated_data["google_code"]

        tokens = GoogleAuthService.exchange_code_for_tokens(google_code)
        id_info = GoogleAuthService.extract_user_info(tokens["id_token"])
        email = id_info.get("email")
        name = id_info.get("given_name", "") + id_info.get("family_name", "")

        # Login or Signup
        user, created = GoogleAuthService.get_or_create_user(email, name)

        access_token, refresh_token = generate_tokens_for_user(user)
        response_data = {"access_token": access_token, "user": UserSerializer(user).data, "created": created}

        response = Response(response_data, status=200)
        set_jwt_cookies(response, access_token, refresh_token)

        return response


class VerifyEmail(BaseUserGenericAPIView):
    """Verify user email address using token from email link."""

    def get(self, request: Request, uidb64: str, token: str, *args, **kwargs) -> Response:
        """Verify email token and mark user as verified.

        Args:
            request: HTTP request
            uidb64: Base64 encoded user ID
            token: Email verification token

        Returns:
            Response: Success status (200)
        """
        user = validate_onetime_token_and_get_user(uidb64, token)
        user.is_verified = True
        user.save()
        return Response(status=status.HTTP_200_OK)


class ResendVerificationEmail(BaseUserGenericAPIView):
    """Resend email verification link to user."""

    serializer_class = SendEmailSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        """Send verification email to specified address.

        Args:
            request: HTTP request with email field

        Returns:
            Response: Success status (200) or error if already verified
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, email=serializer.data["email"])
        if user.is_verified:
            return Response({"detail": "Email is already verified"}, status=400)
        uid, token = generate_uid_and_token(user)
        send_verification_email(user, uid, token)
        return Response(status=200)


class LogoutView(BaseUserGenericAPIView):
    """Handle user logout by clearing JWT cookies."""

    def get(self, request: Request, *args, **kwargs) -> Response:
        """Clear JWT authentication cookies.

        Args:
            request: HTTP request

        Returns:
            Response: Success status (200) with cleared cookies
        """
        response = Response(status=status.HTTP_200_OK)
        unset_jwt_cookies(response)
        return response


class TokenRefreshView(JwtTokenRefreshView, BaseUserGenericAPIView):
    """Refresh JWT tokens using refresh token."""

    def post(self, request: Request, *args, **kwargs) -> Response:
        """Refresh access token using refresh token.

        Args:
            request: HTTP request with refresh_token

        Returns:
            Response: New access token, set in cookies
        """
        response = super().post(request, *args, **kwargs)
        set_jwt_cookies(
            response,
            response.data.get("access_token"),
            response.data.get("refresh_token"),
        )
        return response


class PasswordResetView(BaseUserGenericAPIView):
    """Send password reset email to user."""

    serializer_class = SendEmailSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        """Send password reset link to user's email.

        Args:
            request: HTTP request with email field

        Returns:
            Response: Success status (200)
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, email=serializer.data["email"])
        uid, token = generate_uid_and_token(user)
        send_reset_password_email(user, uid, token)
        return Response(status=200)


class PasswordResetConfirmView(BaseUserGenericAPIView):
    """Confirm and apply new password from reset token."""

    serializer_class = PasswordResetConfirmSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        """Update user password after validation.

        Args:
            request: HTTP request with uidb64, token, and new_password

        Returns:
            Response: Success status (200)
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
