from rest_framework import serializers
from .models import User, Saleswoman, Administrator
from django.contrib.auth import get_user_model
from django.db import transaction

class SaleswomanSerialeizer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = Saleswoman
        fields = ['saleswoman_id','administrator','first_name','last_name','email','phone','status','username','role','created_at', 'password']
        read_only_fields = ['saleswoman_id', 'created_at']
        extra_kwargs = {
            'email': {
                'error_messages': {'unique': 'Este correo ya está registrado en el sistema.'}
            },
            'username': {
                'error_messages': {'unique': 'Este nombre de usuario ya está registrado.'}
            }
        }


    #validaciones de los campos
    def validate_email(self, value):
        User = get_user_model()
        email_map = value.lower()
        user_exists = User.objects.filter(email = email_map)

        if self.instance:
            user_exists = user_exists.exclude(email= self.instance.email)

        if user_exists.exists():
            raise serializers.ValidationError("Este correo ya esta registrado")
        return email_map
    
    def validate_username(self, value):
        User = get_user_model()
        user_exists = User.objects.filter(username = value)

        if self.instance:
            user_exists = user_exists.exclude(username= self.instance.username)

        if user_exists.exists():
            raise serializers.ValidationError("Este nombre de usuario ya está ocupado por otro usuario.")
        
        return value

    def validate_phone(self, value):
        if len(value) > 15:
           raise serializers.ValidationError("El numero de telefono debe de cumplir este formato ej. 0412-000.00.00")
        return value
    
    def validate_password(self, value):
        if len(value) < 6:
           raise serializers.ValidationError("la clave debe de tener al menos 6 digitos")
        return value
    

    
    
    
    #Metodos modificados


    def create(self, validated_data):
        """ 
        En esta funcion se extrae la clave antes de que se cree la vendedora luego se crea con lo que quedo 
        creamos la vendedora esto activa el signal que a su ves crea el User, luego busca el User creado y 
        le asigna la clave real,  o sea guarda en User no en la vendedora la clave
        """
        password = validated_data.pop('password') 
        User = get_user_model() 
    
        with transaction.atomic():
            saleswoman = Saleswoman.objects.create(**validated_data)

            User.objects.create_user(
                username = saleswoman.username,
                email = saleswoman.email,
                password= password,
                role = User.SALESWOMAN,
                profile_id= saleswoman.pk
            )

            return saleswoman
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        User = get_user_model()

        with transaction.atomic():
            email_viejo = instance.email

            instance = super().update(instance, validated_data)
            try:
                user = User.objects.get(email=email_viejo)
                user.username = validated_data.get('username', user.username)
                user.email = validated_data.get('email', user.email)
                user.role = validated_data.get('role', user.role)
                user.is_active = validated_data.get('status', user.is_active)
                if password:
                    user.set_password(password)
                user.save()
            except User.DoesNotExist:
                raise serializers.ValidationError("No se encontró el usuario de autenticación vinculado.")

            return instance
    
   





class AdministratorSerialeizer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = Administrator
        fields = ['administrator_id','first_name','last_name','email','username','role','created_at', 'password']
        read_only_fields = ['administrator_id', 'created_at']
        extra_kwargs = {
            'email': {
                'error_messages': {'unique': 'Este correo ya está registrado en el sistema.'}
            },
            'username': {
                'error_messages': {'unique': 'Este nombre de usuario ya está registrado.'}
            }
        }

    #validaciones de los campos
    
    def validate_password(self, value):
        if len(value) < 6:
           raise serializers.ValidationError("la clave debe de tener al menos 6 digitos")
        return value

    def validate_username(self, value):
        User = get_user_model()
        user_exists = User.objects.filter(username = value)

        if self.instance:
            user_exists = user_exists.exclude(username= self.instance.username)

        if user_exists.exists():
            raise serializers.ValidationError("Este nombre de usuario ya está ocupado por otro usuario.")
        
        return value

    
    def validate_email(self, value):
        User = get_user_model()
        email_map = value.lower()
        user_exists = User.objects.filter(email = email_map)

        if self.instance:
            user_exists = user_exists.exclude(email= self.instance.email)

        if user_exists.exists():
            raise serializers.ValidationError("Este correo ya esta registrado")
        return email_map

    #metodo create 

    def create(self, validated_data):
        """ 
        En esta funcion se extrae la clave antes de que se cree el administrador luego se crea con lo que quedo 
        creamos el administrador esto activa el signal que a su ves crea el User, luego busca el User creado y 
        le asigna la clave real,  o sea guarda en User no en administrador la clave
        """
        password = validated_data.pop('password') 
    
        with transaction.atomic():
            administrator = Administrator.objects.create(**validated_data)
            
            user = User.objects.get(email = administrator.email)
            user.set_password(password)
            user.save()

            return administrator
        
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        with transaction.atomic():
            instance = super().update(instance, validated_data)

            user = get_user_model().objects.get(email=instance.email)
            user.username = validated_data.get('username', user.username)
            user.email = validated_data.get('email', user.email)
            if password:
                user.set_password(password)
            user.save()
            return instance


