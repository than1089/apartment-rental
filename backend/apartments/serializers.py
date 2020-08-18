from rest_framework import serializers
from .models import Apartment
from users.models import User
from django.contrib.gis.geos import Point


class ApartmentSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, required=False)
    image = serializers.ImageField()
    realtor = serializers.SerializerMethodField()
    realtor_email = serializers.SerializerMethodField()
    lat = serializers.DecimalField(max_digits=9, decimal_places=6)
    lng = serializers.DecimalField(max_digits=9, decimal_places=6)

    class Meta:
        model = Apartment
        fields = '__all__'
    
    def get_realtor(self, obj):
        return '{} {}'.format(obj.realtor.first_name, obj.realtor.last_name)
    
    def get_realtor_email(self, obj):
        return obj.realtor.email

    def to_internal_value(self, data):
        if ('lng' in data and 'lat' in data):
            data['location'] = Point(float(data.get('lng')), float(data.get('lat')), srid=4326)
        return data
