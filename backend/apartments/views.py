from rest_framework import viewsets
from .serializers import ApartmentSerializer
from .models import Apartment
from users.models import User
from rest_framework.permissions import IsAuthenticated


class ApartmentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = ApartmentSerializer
    queryset = Apartment.objects.all()

    def get_queryset(self):
        user = self.request.user
        # Admin can view all Apartments
        if user.role != User.ADMIN:
            return Apartment.objects.filter(realtor=user)
        return Apartment.objects.all()

    def perform_create(self, serializer):
        # When created, owner will be current user
        serializer.save(realtor=self.request.user)
