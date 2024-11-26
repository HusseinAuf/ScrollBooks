from users.models import User
from django.conf import settings


def create_superuser():
    if User.objects.filter(email=settings.DJANGO_SUPERUSER_EMAIL).exists():
        return
    User.objects.create_superuser(
        email=settings.DJANGO_SUPERUSER_EMAIL,
        password=settings.DJANGO_SUPERUSER_PASSWORD,
    )
    print("Superuser created")
