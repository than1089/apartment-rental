from rest_framework import serializers
from .models import Apartment
from users.models import User
from django.contrib.gis.geos import Point


class ApartmentSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, required=False)
    realtor = serializers.SerializerMethodField()
    lat = serializers.DecimalField(max_digits=9, decimal_places=6)
    lng = serializers.DecimalField(max_digits=9, decimal_places=6)

    class Meta:
        model = Apartment
        fields = '__all__'
    
    def get_realtor(self, obj):
        return '{} {}'.format(obj.realtor.first_name, obj.realtor.last_name)

    def to_internal_value(self, data):
        if ('lng' in data and 'lat' in data):
            data['location'] = Point(float(data.get('lng')), float(data.get('lat')), srid=4326)
        return data
