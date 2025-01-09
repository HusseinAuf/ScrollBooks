from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
from django.conf import settings
from books.models import Order, OrderStatus, OrderItem
from django.db import transaction

stripe.api_key = settings.STRIPE_SECRET_KEY


@csrf_exempt
def stripe_webhook(request):
    """
    Endpoint to handle Stripe webhooks.
    """
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return HttpResponse(status=400)  # Invalid payload
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)  # Invalid signature

    # Process the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # Add logic to handle order confirmation
        handle_payment_succeeded(session["id"])
    elif event["type"] == "payment_intent.payment_failed":
        session = event["data"]["object"]
        handle_payment_failed(session["id"])
    else:
        print(f"Unhandled event type {event['type']}")

    return HttpResponse(status=200)


def handle_payment_succeeded(stripe_session_id):
    """
    Mark the order as completed in the database.
    """
    with transaction.atomic():
        order = Order.objects.prefetch_related("order_items__book").get(stripe_session_id=stripe_session_id)
        order.status = OrderStatus.COMPLETED.value
        order.save()
        books = [order_item.book for order_item in order.order_items]
        order.user.library.add(*books)


def handle_payment_failed(stripe_session_id):
    """
    Mark the order as canceled in the database.
    """
    order = Order.objects.get(stripe_session_id=stripe_session_id)
    order.status = OrderStatus.CANCELED.value
    order.save()
