from rest_framework import permissions
from users.models import User


class ApartmentPermission(permissions.BasePermission):
    """
    Check permission for apartments enpoints
    """

    def has_permission(self, request, view):
        # Everyone can view
        # Admin can do everything
        if view.action in ['list', 'retrieve'] or User.ADMIN == request.user.role:
            return True

        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            return request.user and request.user.is_authenticated \
                and request.user.role == User.REALTOR

        return False
