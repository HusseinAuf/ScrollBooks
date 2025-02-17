import factory
from factory import Faker
from factory.django import DjangoModelFactory
from users.models import User


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    email = Faker("email")
    password = factory.PostGenerationMethodCall("set_password", "defaultpassword")
    name = Faker("name")
    phone_number = Faker("phone_number")
    is_verified = True

    @factory.post_generation
    def favorite_books(self, create, extracted, **kwargs):
        if create and extracted:
            self.favorite_books.add(*extracted)

    @factory.post_generation
    def library(self, create, extracted, **kwargs):
        if create and extracted:
            self.library.add(*extracted)
