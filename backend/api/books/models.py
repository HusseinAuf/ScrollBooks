from django.db import models
from core.utils import get_random_file_name
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel
from django.core.validators import MinValueValidator, MaxValueValidator


class Author(TimeStampedModel):
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name="author")
    bio = models.TextField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)


class BookCategory(models.TextChoices):
    FICTION = ("fiction", _("Fiction"))
    MYSTERY = ("mystery", _("Mystery/Thriller"))
    ROMANCE = ("romance", _("Romance"))
    SCIENCE_FICTION = ("science_fiction", _("Science Fiction"))
    FANTASY = ("fantasy", _("Fantasy"))
    NON_FICTION = ("non_fiction", _("Non-Fiction"))
    BIOGRAPHY = ("biography", _("Biography/Autobiography"))
    YOUNG_ADULT = ("young_adult", _("Young Adult"))
    CHILDREN = ("children", _("Children's Books"))
    HISTORICAL_FICTION = ("historical_fiction", _("Historical Fiction"))
    HORROR = ("horror", _("Horror"))
    SELF_HELP = ("self_help", _("Self-Help"))
    GRAPHIC_NOVELS = ("graphic_novels", _("Graphic Novels"))
    POETRY = ("poetry", _("Poetry"))
    CLASSICS = ("classics", _("Classics"))


class Category(TimeStampedModel):
    name = models.CharField(max_length=100, choices=BookCategory.choices, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self) -> str:
        return self.name


class FileFormat(models.TextChoices):
    PDF = ("PDF", _("PDF"))
    EPUB = ("EPUB", _("EPUB"))
    MOBI = ("MOBI", _("MOBI"))


class Book(TimeStampedModel):
    def get_book_file_uploaded_path(self, filename):
        return "book-files/" + get_random_file_name(filename)

    def get_cover_image_uploaded_path(self, filename):
        return "cover-images/" + get_random_file_name(filename)

    author = models.ForeignKey("books.Author", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    categories = models.ManyToManyField("books.Category", related_name="books")
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # isbn = models.CharField(max_length=13, unique=True)
    file = models.FileField(upload_to=get_book_file_uploaded_path)
    format = models.CharField(max_length=10, choices=FileFormat.choices)
    cover_image = models.ImageField(upload_to=get_cover_image_uploaded_path, null=True, blank=True)
    published_date = models.DateField()
    download_count = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.title


class Review(TimeStampedModel):
    user = models.ForeignKey("users.User", related_name="reviews", on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name="reviews", on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )  # Ensures rating is between 1 and 5
    comment = models.TextField(blank=True)

    class Meta:
        unique_together = ("user", "book")

    def __str__(self) -> str:
        return f"Review by {self.user} for {self.book}"
