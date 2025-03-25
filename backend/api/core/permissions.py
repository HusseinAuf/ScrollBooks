from rest_framework import permissions


class BasePermissions(permissions.DjangoModelPermissions):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or (not request.user.is_authenticated and self.authenticated_users_only):
            return False
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        if hasattr(view, "permission_relation"):
            relation = view.permission_relation
            try:
                # Dynamically get the related user's ID for permission checking
                related_user_pk = eval(f"obj.{relation}")
                return related_user_pk == user.pk or user.is_superuser
            except AttributeError:
                return False
        return True
