from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend
from users.models import User

from .models import Apartment
from .serializers import ApartmentSerializer
from .filters import ApartmentFilter
from .permissions import ApartmentPermission


class ApartmentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,ApartmentPermission)
    serializer_class = ApartmentSerializer
    queryset = Apartment.objects.all()
    filterset_class = ApartmentFilter

    def perform_create(self, serializer):
        # When created, realtor will be current user
        serializer.save(realtor=self.request.user)
