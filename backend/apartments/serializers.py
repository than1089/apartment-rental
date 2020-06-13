from rest_framework import serializers
from .models import Apartment
from users.models import User


class ApartmentSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, required=False)
    realtor = serializers.SerializerMethodField()
    class Meta:
        model = Apartment
        fields = '__all__'
    
    def get_realtor(self, obj):
        return '{} {}'.format(obj.realtor.first_name, obj.realtor.last_name)
