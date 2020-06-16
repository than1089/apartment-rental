from django.contrib.gis.db.models.functions import GeometryDistance
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django_filters import rest_framework as filters

from users.models import User

from .models import Apartment


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
        parent = self.get_filter_for_map(super().qs)
        
        user = self.request.user
        # Admins and Realtors can see all appartments
        if user.role in [User.ADMIN, User.REALTOR]:
            return parent

        return parent.filter(status=Apartment.AVAILABLE).all()
    
    def get_filter_for_map(self, queryset):
        query_params = self.request.query_params
        lat = query_params.get('lat')
        lng = query_params.get('lng')
        distance = query_params.get('distance', 10000)
        if lat and lng:
            ref_location = Point(float(lng), float(lat), srid=4326)
            queryset = queryset.filter(location__distance_lt=(ref_location, D(m=float(distance))))\
                        .annotate(distance=GeometryDistance("location", ref_location))\
                        .order_by("distance")
        return queryset
