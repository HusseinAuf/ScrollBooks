import io
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image


def create_mock_pdf_file():
    """
    Create a mock PDF file.
    """
    pdf_file = SimpleUploadedFile(
        name="test_document.pdf",
        content=b"%PDF-1.4\n%mock PDF content",  # Mock minimal PDF content
        content_type="application/pdf",
    )
    return pdf_file


def create_mock_image(name="test_image.png", size=(100, 100), color=(255, 0, 0)):
    """
    Create a mock PNG image in memory.
    """
    # Create an in-memory image
    image = Image.new("RGB", size, color)
    image_file = io.BytesIO()
    image.save(image_file, format="PNG")
    image_file.seek(0)  # Move the pointer to the start of the file
    return SimpleUploadedFile(name, image_file.read(), content_type="image/png")
