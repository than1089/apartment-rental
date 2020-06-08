from rest_framework import serializers, exceptions
from .models import User


class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    email = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(max_length=128, required=True, write_only=True)
    role = serializers.CharField(required=False)
    is_active = serializers.BooleanField(default=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'role', 'is_active']
    
    def save(self, request):
        return None

    def create(self, validated_data):
        self.validate_role(validated_data['role'])
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        for field in ['first_name', 'last_name', 'email', 'username', 'role', 'is_active']:
            if field in validated_data:
                setattr(instance, field, validated_data.get(field))

        if validated_data.get('password'):
            instance.set_password(validated_data.get('password'))
        instance.save()
        return instance



class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(default='')
    last_name = serializers.CharField(default='')
    email = serializers.EmailField(required=True)
    password = serializers.CharField(max_length=128, min_length=6, required=True, write_only=True)
    role = serializers.CharField(default=User.CLIENT)
    is_active = serializers.BooleanField(default=True)

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise exceptions.ValidationError('This email address alredy exists.')
        return email

    def validate_role(self, role):
        if role != User.ADMIN:
            return role
        # Validate when is allowed to add Admin role
        user = None
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
        
        if not user or (user and user.role != User.ADMIN):
            raise serializers.ValidationError('Role Admin is protected.')

        return role
    
    def get_validated_data(self):
        email = self.validate_email(self.validated_data['email'])
        role = self.validate_role(self.validated_data['role'])
        return {
            'first_name': self.validated_data['first_name'],
            'last_name': self.validated_data['last_name'],
            'username': email,
            'email': email,
            'password': self.validated_data['password'],
            'role': role
        }

    def save(self, request):
        return User.objects.create_user(**self.get_validated_data())
