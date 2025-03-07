from rest_framework.permissions import DjangoModelPermissions


class BasePermissions(DjangoModelPermissions):
    def has_permission(self, request, view):
        if view.action in ["list", "retrieve"]:
            return True
        if not request.user or (not request.user.is_authenticated and self.authenticated_users_only):
            return False
        return True

    def has_object_permission(self, request, view, obj):
        if view.action not in ["update", "partial_update", "delete"]:
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
