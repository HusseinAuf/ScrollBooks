from django.db import models
from core.utils import get_random_file_name
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from core.models import BaseModel


class Author(BaseModel):
    def get_author_picture_upload_path(self, filename):
        return "author-profile-pictures/" + get_random_file_name(filename)

    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name="author")
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    picture = models.ImageField(upload_to=get_author_picture_upload_path, blank=True, null=True)

    class Meta:
        ordering = ["-created", "user"]

    def __str__(self) -> str:
        return self.user.email


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
    EDUCATION = ("education", _("Education"))
    HISTORY = ("history", _("History"))
    ART = ("art", _("Art & Photography"))
    SCIENCE = ("science", _("Science"))
    RELIGION = ("religion", _("Religion/Spirituality"))
    BUSINESS = ("business", _("Business & Economics"))
    HEALTH = ("health", _("Health & Wellness"))
    COOKING = ("cooking", _("Cooking/Food"))


class BookLanguage(models.TextChoices):
    EN = ("en", "English")
    FR = ("fr", "French")
    DE = ("de", "German")
    ES = ("es", "Spanish")
    AR = ("ar", "Arabic")


class Category(BaseModel):
    name = models.CharField(max_length=100, choices=BookCategory.choices, unique=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["-created", "name"]

    def __str__(self) -> str:
        return self.name


class CurrencyType(models.TextChoices):
    USD = "USD", ("USD")
    EUR = "EUR", ("EUR")
    GBP = "GBP", ("GBP")


class Book(BaseModel):
    def get_book_file_uploaded_path(self, filename):
        return "book-files/" + get_random_file_name(filename)

    def get_cover_image_uploaded_path(self, filename):
        return "book-cover-images/" + get_random_file_name(filename)

    author = models.ForeignKey("books.Author", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    categories = models.ManyToManyField("books.Category", related_name="books")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, choices=CurrencyType.choices, default=CurrencyType.USD.value)
    file = models.FileField(upload_to=get_book_file_uploaded_path)
    cover_image = models.ImageField(upload_to=get_cover_image_uploaded_path, blank=True, null=True)
    published_date = models.DateField(blank=True, null=True)
    language = models.CharField(max_length=2, choices=BookLanguage.choices, default=BookLanguage.EN.value)

    class Meta:
        ordering = ["-created", "title"]

    def __str__(self) -> str:
        return self.title


class OrderStatus(models.TextChoices):
    PENDING = ("pending", _("Pending"))
    COMPLETED = ("completed", _("Completed"))
    CANCELED = ("canceled", _("Canceled"))


class Order(BaseModel):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="orders")
    stripe_session_id = models.CharField(max_length=255, blank=True)
    stripe_session_url = models.URLField(max_length=500, blank=True)
    status = models.CharField(max_length=10, choices=OrderStatus.choices, default=OrderStatus.PENDING.value)

    class Meta:
        ordering = ["-created"]

    def total_price(self):
        return sum(item.price for item in self.order_items.all())

    def __str__(self):
        return f"Order {self.id} by {self.user.email}"


class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at the time of purchase

    class Meta:
        ordering = ["book"]

    def __str__(self):
        return f"{self.book.title} in Order {self.order.id}"


class Review(BaseModel):
    user = models.ForeignKey("users.User", related_name="reviews", on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name="reviews", on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )  # Ensures rating is between 1 and 5
    comment = models.TextField(blank=True)

    class Meta:
        unique_together = ("user", "book")
        ordering = ["-created"]

    def __str__(self) -> str:
        return f"Review by {self.user.email} for {self.book.title}"


class Cart(BaseModel):
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, unique=True, related_name="cart")

    def __str__(self):
        return f"Cart of {self.user.email}"

    @property
    def total_price(self):
        return sum(item.price for item in self.cart_items.all())


class CartItem(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cart_items")
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("cart", "book")
        ordering = ["-created", "book"]

    def __str__(self) -> str:
        return f"{self.cart.user.email} | {self.book.title}"

    @property
    def price(self):
        return self.book.price
