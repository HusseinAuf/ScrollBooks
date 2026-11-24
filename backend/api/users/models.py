from typing import Any, Optional

from core.models import BaseModel
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""

    def create_user(self, email: str, password: Optional[str] = None, **extra_fields: Any) -> "User":
        """Create and save a regular user with the given email and password.

        Args:
            email: User's email address (must be unique)
            password: User's password (hashed before saving)
            **extra_fields: Additional user fields

        Returns:
            User: The created user instance

        Raises:
            ValueError: If email is not provided
        """
        if not email:
            raise ValueError("User must have an email address.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: Optional[str] = None, **extra_fields: Any) -> "User":
        """Create and save a superuser with the given email and password.

        Args:
            email: Superuser's email address
            password: Superuser's password
            **extra_fields: Additional user fields

        Returns:
            User: The created superuser instance
        """
        user = self.create_user(email, password, **extra_fields)
        user.is_verified = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    """Custom user model using email as the username field.

    Attributes:
        email: User's unique email address
        name: User's full name
        phone_number: User's phone number for contact
        favorite_books: ManyToMany relation to favorited books
        library: ManyToMany relation to owned books
        is_staff: Whether user has staff privileges
        is_active: Whether user account is active
        is_verified: Whether user has verified their email address
    """

    email = models.EmailField(max_length=254, verbose_name=_("email address"), unique=True)
    name = models.CharField(max_length=150, blank=True)
    phone_number = models.CharField(max_length=30, blank=True)
    favorite_books = models.ManyToManyField("books.Book", blank=True, related_name="favorited_by")
    library = models.ManyToManyField("books.Book", blank=True, related_name="users_with_library")
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)  # Tracks email verification status

    objects = UserManager()
    USERNAME_FIELD = "email"

    class Meta:
        ordering = ["-created"]

    @property
    def is_author(self) -> bool:
        """Check if user has an associated author profile.

        Returns:
            bool: True if user is an author, False otherwise
        """
        return hasattr(self, "author") and self.author is not None

    def __str__(self) -> str:
        """Return string representation of the user.

        Returns:
            str: User's email address
        """
        return self.email
