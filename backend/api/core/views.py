from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from core.paginations import BasePagination
from core.renderers import BaseJSONRenderer, BaseBrowsableAPIRenderer
from core.permissions import BasePermissions


class BaseViewSet(viewsets.ModelViewSet):
    model = None
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    pagination_class = BasePagination
    permission_classes = [
        BasePermissions,
    ]
    renderer_classes = [BaseJSONRenderer, BaseBrowsableAPIRenderer]
