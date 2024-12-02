from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from core.paginations import BasePagination
from core.renderers import BaseJSONRenderer, BaseBrowsableAPIRenderer
from core.permissions import BasePermissions
from rest_framework.exceptions import MethodNotAllowed
from collections import OrderedDict
from rest_framework.response import Response


class BaseViewSet(viewsets.ModelViewSet):
    model = None
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    pagination_class = BasePagination
    permission_classes = [
        BasePermissions,
    ]
    renderer_classes = [BaseJSONRenderer, BaseBrowsableAPIRenderer]

    def get_list_response(self, data, queryset):
        return Response(
            {
                "meta": OrderedDict(
                    [
                        ("count", queryset.count()),
                    ]
                ),
                "data": data,
            }
        )


def method_not_allowed(method):
    raise MethodNotAllowed(method=method)


class NonListableViewSet(viewsets.ModelViewSet):
    def list(self, request, *args, **kwargs):
        return method_not_allowed(request.method)


class NonCreatableViewSet(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        return method_not_allowed(request.method)


class NonUpdatableViewSet(viewsets.ModelViewSet):
    def update(self, request, *args, **kwargs):
        return method_not_allowed(request.method)

    def partial_update(self, request, *args, **kwargs):
        return method_not_allowed(request.method)


class NonDeletableViewSet(viewsets.ModelViewSet):
    def destroy(self, request, *args, **kwargs):
        return method_not_allowed(request.method)
