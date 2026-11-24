"""Base view classes and mixins for REST API endpoints."""
from collections import OrderedDict
from typing import Any, Dict, Optional

from core.paginations import BasePagination
from core.permissions import BasePermissions
from core.renderers import BaseBrowsableAPIRenderer, BaseJSONRenderer
from django.db.models import QuerySet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response


class BaseViewSet(viewsets.ModelViewSet):
    """Base ViewSet with common configurations for all API endpoints.

    Features:
    - Filtering with DjangoFilterBackend and OrderingFilter
    - Pagination with BasePagination
    - Custom JSON renderers
    - Standard permissions
    - Metadata pagination responses

    Attributes:
        model: The Django model this viewset operates on
        filter_backends: List of filter backends for this viewset
        pagination_class: Pagination class for list responses
        permission_classes: Permission classes checking access
        renderer_classes: Response renderers (JSON + browsable API)
    """

    model = None
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    pagination_class = BasePagination
    permission_classes = [
        BasePermissions,
    ]
    renderer_classes = [BaseJSONRenderer, BaseBrowsableAPIRenderer]

    def get_list_response(self, data: list, queryset: QuerySet) -> Response:
        """Create a list response with metadata.

        Args:
            data: Serialized list data
            queryset: Original queryset used for metadata

        Returns:
            Response: Response with meta and data fields
        """
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

    def list(self, request, *args, **kwargs) -> Response:
        """List objects with filtering, ordering, and pagination.

        Returns paginated response with metadata if pagination is used,
        otherwise returns full list.

        Returns:
            Response: List of serialized objects with pagination metadata
        """
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return self.get_list_response(serializer.data, queryset)


class NonListableViewSet(viewsets.ModelViewSet):
    """Mixin to disable list endpoint.

    Raises MethodNotAllowed for HTTP methods that attempt to list objects.
    """

    def list(self, request, *args, **kwargs):
        """Disable listing of objects.

        Raises:
            MethodNotAllowed: Always raised as this endpoint is disabled
        """
        raise MethodNotAllowed(method=request.method)


class NonCreatableViewSet(viewsets.ModelViewSet):
    """Mixin to disable create endpoint.

    Raises MethodNotAllowed for POST requests to create objects.
    """

    def create(self, request, *args, **kwargs):
        """Disable creation of objects.

        Raises:
            MethodNotAllowed: Always raised as this endpoint is disabled
        """
        raise MethodNotAllowed(method=request.method)


class NonUpdatableViewSet(viewsets.ModelViewSet):
    """Mixin to disable update endpoints.

    Raises MethodNotAllowed for PUT/PATCH requests to update objects.
    """

    def update(self, request, *args, **kwargs):
        """Disable full update of objects.

        Raises:
            MethodNotAllowed: Always raised as this endpoint is disabled
        """
        raise MethodNotAllowed(method=request.method)

    def partial_update(self, request, *args, **kwargs):
        """Disable partial update of objects.

        Raises:
            MethodNotAllowed: Always raised as this endpoint is disabled
        """
        raise MethodNotAllowed(method=request.method)


class NonDeletableViewSet(viewsets.ModelViewSet):
    """Mixin to disable delete endpoint.

    Raises MethodNotAllowed for DELETE requests to remove objects.
    """

    def destroy(self, request, *args, **kwargs):
        """Disable deletion of objects.

        Raises:
            MethodNotAllowed: Always raised as this endpoint is disabled
        """
        raise MethodNotAllowed(method=request.method)


class NonRetrievableViewSet(viewsets.ModelViewSet):
    """Mixin to disable retrieve endpoint.

    Raises MethodNotAllowed for GET requests to retrieve individual objects.
    """

    def retrieve(self, request, *args, **kwargs):
        """Disable retrieval of individual objects.

        Raises:
            MethodNotAllowed: Always raised as this endpoint is disabled
        """
        raise MethodNotAllowed(method=request.method)
