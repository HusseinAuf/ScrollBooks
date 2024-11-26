"""
Django settings for api project.

Generated by 'django-admin startproject' using Django 3.2.12.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
from pathlib import Path
import environ
from datetime import timedelta
from urllib.parse import urljoin

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent
print(BASE_DIR)
print(BASE_DIR.parent)
# Read environment variables
environ.Env.read_env(BASE_DIR / ".env")
env = environ.Env()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

ALLOWED_HOSTS = [env("API_HOSTNAME")]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_celery_beat",
    "django_celery_results",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "rest_framework.authtoken",
    "corsheaders",
    "users.apps.UsersConfig",
    "books.apps.BooksConfig",
    "core.apps.CoreConfig",
    "django_filters",
    "drf_spectacular",
    "phonenumber_field",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]

ROOT_URLCONF = "api.urls"


ASGI_APPLICATION = "api.asgi.application"
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis", 6379)],
            "capacity": 50000,
        },
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": env.db(),
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# celery settings
# CELERY_BROKER_URL = "redis://redis:6379"
# CELERY_RESULT_BACKEND = "redis://redis:6379"

# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-broker_url
CELERY_BROKER_URL = env("REDIS_URL")
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_backend
CELERY_RESULT_BACKEND = "django-db"
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-accept_content
CELERY_ACCEPT_CONTENT = ["json"]
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-task_serializer
CELERY_TASK_SERIALIZER = "json"
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_serializer
CELERY_RESULT_SERIALIZER = "json"
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-time-limit
CELERY_TASK_TIME_LIMIT = 240 * 60
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-soft-time-limit
CELERY_TASK_SOFT_TIME_LIMIT = 120 * 60
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#beat-scheduler
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

# SMTP configuration
# For more information, see
# https://support.google.com/mail/answer/7126229?hl=en#zippy=%2Cstep-check-that-imap-is-turned-on%2Cstep-change-smtp-other-settings-in-your-email-client
# https://docs.djangoproject.com/en/4.1/ref/settings/#std-setting-EMAIL_HOST
EMAIL_BACKEND = env("EMAIL_BACKEND")
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_USE_TLS = env("EMAIL_USE_TLS")
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_HOST_NAME = env.str("EMAIL_HOST_NAME", default="ScrollBooks")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_FILE_PATH = BASE_DIR / "storage/email_messages"

API_ROOT_URL = env("API_ROOT_URL")
WEB_ROOT_URL = env("WEB_ROOT_URL")

JWT_SECRET_KEY = env("JWT_SECRET_KEY")

# REST_FRAMEWORK = {"EXCEPTION_HANDLER": "tender.utils.drf_exception_handler"}

CORS_ALLOWED_ORIGINS = [env("WEB_ROOT_URL"), "http://localhost:3000"]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/
STATIC_URL = "/django_static/"
STATIC_ROOT = BASE_DIR / "storage/django_static"

# Media files (Files, images, etc...)
MEDIA_URL = "/django_media/"
MEDIA_ROOT = BASE_DIR / "/storage/django_media"


LOGO_PATH = "logos/scrollbooks_logo.png"
# SECURE_SSL_REDIRECT = False
# USE_X_FORWARDED_HOST = True
# SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

GLOBAL_CONTEXT = {
    "LOGO_URL": urljoin(API_ROOT_URL, urljoin(MEDIA_URL, LOGO_PATH)),
    "MEDIA_URL": MEDIA_URL,
}


CSRF_TRUSTED_ORIGINS = [env("API_ROOT_URL")]

ENABLE_DB_SEEDING_AFTER_MIGRATION = True
PAGINATION_MAX_PAGE_SIZE = 10
PAGINATION_PAGE_SIZE = 10

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_AUTHENTICATION_CLASSES": ("users.authentication.JWTCookieAuthentication",),
    "DEFAULT_RENDERER_CLASSES": (
        "core.renderers.BaseJSONRenderer",
        "core.renderers.BaseBrowsableAPIRenderer",
        "rest_framework.renderers.JSONRenderer",
    ),
    "NON_FIELD_ERRORS_KEY": "non-field-errors",
    "DEFAULT_PAGINATION_CLASS": "core.paginations.BasePagination",
    "PAGE_SIZE": env.int("PAGE_SIZE", default=10),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# Swagger Configurations
SPECTACULAR_SETTINGS = {
    "TITLE": "Property App API",
    "DESCRIPTION": "Property application",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
}

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ACCESS_TOKEN_LIFETIME": timedelta(days=60),  # Just for testing purposes, should be 5 minutes in production
    "REFRESH_TOKEN_LIFETIME": timedelta(days=15),  # Just for testing purposes, should be 1 day in production
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    # 'SIGNING_KEY': SECRET_KEY,
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "JWT_CLAIM": "jti",
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_OBTAIN_SERIALIZER": "users.serializers.BaseTokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "users.serializers.CookieTokenRefreshSerializer",
}

DJANGO_SUPERUSER_EMAIL = env("DJANGO_SUPERUSER_EMAIL")
DJANGO_SUPERUSER_PASSWORD = env("DJANGO_SUPERUSER_PASSWORD")

JWT_AUTH_ACCESS_COOKIE_NAME = env.str("JWT_AUTH_ACCESS_COOKIE_NAME", default="access_token")
JWT_AUTH_ACCESS_COOKIE_PATH = env.str("JWT_AUTH_ACCESS_COOKIE_PATH", default="/")

JWT_AUTH_REFRESH_COOKIE_NAME = env.str("JWT_AUTH_REFRESH_COOKIE_NAME", default="refresh_token")
JWT_AUTH_REFRESH_COOKIE_PATH = env.str("JWT_AUTH_REFRESH_COOKIE_PATH", default="/")

JWT_AUTH_COOKIE_HTTPONLY = env.bool("JWT_AUTH_ACCESS_COOKIE_HTTPONLY", default=True)
JWT_AUTH_COOKIE_SECURE = env.bool("JWT_AUTH_ACCESS_COOKIE_SECURE", default=False)
JWT_AUTH_COOKIE_SAMESITE = env.str("JWT_AUTH_ACCESS_COOKIE_SAMESITE", default="Lax")
