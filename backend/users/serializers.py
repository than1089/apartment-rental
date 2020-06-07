from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(max_length=128, required=True, write_only=True)
    role = serializers.CharField(required=False)
    is_active = serializers.BooleanField(default=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'role', 'is_active']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        for field in ['first_name', 'last_name', 'email', 'username', 'role', 'is_active']:
            if field in validated_data:
                setattr(instance, field, validated_data.get(field))

        if validated_data.get('password'):
            instance.set_password(validated_data.get('password'))
        instance.save()
        return instance
