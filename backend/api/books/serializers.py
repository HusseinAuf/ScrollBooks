from books.models import Book, Author, Category, Review
from core.serializers import BaseSerializer


class AuthorSerializer(BaseSerializer):
    class Meta:
        model = Author
        fields = "__all__"


class CategorySerializer(BaseSerializer):
    class Meta:
        model = Category
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["display_name"] = instance.get_name_display()
        return data


class BookSerializer(BaseSerializer):
    class Meta:
        model = Book
        fields = "__all__"
        read_only_fields = ["author", "download_count"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["categories"] = CategorySerializer(instance.categories, many=True).data
        data["author"] = AuthorSerializer(instance.author).data
        return data


class ReviewSerializer(BaseSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["user"]

    def to_representation(self, instance):
        from users.serializers import UserSerializer

        data = super().to_representation(instance)
        data["user"] = UserSerializer(instance.user).data
        return data
