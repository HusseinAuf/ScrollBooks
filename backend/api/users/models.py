from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils.translation import gettext_lazy as _
from core.models import BaseModel


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("User must have an email address.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        user.is_verified = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
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
    def is_author(self):
        return hasattr(self, "author") and self.author is not None

    def __str__(self):
        return self.email
