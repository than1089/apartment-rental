from django_filters import rest_framework as filters
from .models import Apartment
from users.models import User


class ApartmentFilter(filters.FilterSet):
    min_size = filters.NumberFilter(field_name="floor_area_size", lookup_expr='gte')
    max_size = filters.NumberFilter(field_name="floor_area_size", lookup_expr='lte')
    min_price = filters.NumberFilter(field_name="price_per_month", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price_per_month", lookup_expr='lte')

    class Meta:
        model = Apartment
        fields = ['min_size', 'max_size', 'min_price', 'max_price', 'number_of_rooms', 'realtor']

    @property
    def qs(self):
        parent = super().qs
        user = self.request.user
        # Admins and Realtors can see all appartments
        if user.role in [User.ADMIN, User.REALTOR]:
            return parent

        return parent.filter(status=Apartment.AVAILABLE).all()
