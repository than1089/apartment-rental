from rest_framework import serializers, exceptions
from .models import User


class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(allow_blank=True, required=False)
    last_name = serializers.CharField(allow_blank=True, required=False)
    email = serializers.CharField(required=True)
    password = serializers.CharField(max_length=128, required=True, write_only=True)
    role = serializers.CharField(required=False)
    is_active = serializers.BooleanField(default=True)
    login_attempts = serializers.IntegerField(read_only=True)
    verified_email = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'password',
            'role', 'is_active', 'login_attempts', 'verified_email', 'profile_img']

    def update(self, instance, validated_data):
        for field in ['first_name', 'last_name', 'email', 'role', 'is_active']:
            if field in validated_data:
                setattr(instance, field, validated_data.get(field))

        if validated_data.get('password'):
            instance.set_password(validated_data.get('password'))
        instance.save()
        return instance
    
    def get_verified_email(self, obj):
        email_address = obj.emailaddress_set.get(email=obj.email)
        return email_address.verified


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(allow_blank=True, required=False)
    last_name = serializers.CharField(allow_blank=True, required=False)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(max_length=128, min_length=6, required=True, write_only=True)
    role = serializers.CharField(default=User.CLIENT)
    is_active = serializers.BooleanField(default=True)

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise exceptions.ValidationError('This email address alredy exists.')
        return email

    def validate_role(self, role):
        if role not in [User.CLIENT, User.REALTOR, User.ADMIN]:
            raise serializers.ValidationError('Invalid role.')
        
        # Only allow Admin registration with an Admin authorization role
        if role == User.ADMIN:
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                if hasattr(request.user, 'role') and request.user.role == User.ADMIN:
                    return role
            raise serializers.ValidationError('Admin role is protected.')

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


class InviteUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ProfileImageSerializer(serializers.Serializer):
    profile_img = serializers.ImageField()
