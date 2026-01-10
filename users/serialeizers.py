from rest_framework import serializers
from .models import User, Saleswoman, Administrator
from django.db import transaction
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','first_name','last_name','email','password','role','is_active']
        extra_kwargs = {
            'password' : {'write_only': True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
    #validaciones


class SaleswomanSerialeizer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    #contenido para la tabla User
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    is_active = serializers.BooleanField(write_only=True)
    #contenido para la tabla Saleswoman
    phone = serializers.CharField()

    class Meta:
        model = Saleswoman
        fields =['id','user_details','username','first_name','last_name','email','password','is_active', 'phone', 'registered_by', 'created_at']
        extra_kwargs = {
            'registered_by': {'read_only': True},
            'created_at': {'read_only': True},
        }

    #modificacion del metodo create para enviar info a las dos tablas User y Saleswoman
    def create(self, validated_data):
        with transaction.atomic():
        # datos del usuario
            user_data = {
                'username': validated_data.pop('username'),
                'email': validated_data.pop('email'),
                'password': validated_data.pop('password'),
                'first_name': validated_data.pop('first_name'),
                'last_name': validated_data.pop('last_name'),
                'role': User.Rol.VENDEDORA,
                'is_active': validated_data.pop('is_active')
            }
            
            user = User.objects.create_user(**user_data)

            saleswoman = Saleswoman.objects.create(
                user=user, 
                phone=validated_data['phone'],
                registered_by=self.context['request'].user
            )
            return saleswoman
    

    #validaciones

    def validate_phone(self, value):
        if len(value) > 15:
           raise serializers.ValidationError("El numero de telefono debe de ser menor a 15 ej. 0412-000.00.00")
        return value
    
    def validate_password(self, value):
        if len(value) < 6:
           raise serializers.ValidationError("la clave debe de tener al menos 6 digitos")
        return value
    
    def validate_username(self, value):
        User = get_user_model()
        
        if User.objects.filter(username = value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya esta registrado")
        return value
    
    def validate_email(self, value):
        User = get_user_model()
        
        if User.objects.filter(email = value).exists():
            raise serializers.ValidationError("Este correo ya esta registrado")
        return value

# aun falta delete y path para SaleswomanSerialeizer



class AdministratorSerialeizer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = ['id','username','first_name','last_name','email','password','role','is_active']
        extra_kwargs = {
            'password':{'write_only': True},
            'id': {'read_only': True},
            'created_at': {'read_only': True},
        }

        def create(self, validated_data):
            validated_data['role'] = User.Rol.ADMIN
            return User.objects.create_user(**validated_data)
        

        # validacion

        def validate_password(self, value):
            if len(value) < 6:
                raise serializers.ValidationError("la clave debe de tener al menos 6 digitos")
            return value