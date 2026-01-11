from rest_framework import serializers
from .models import User, Saleswoman, Administrator
from django.contrib.auth import get_user_model
from django.db import transaction

class SaleswomanSerialeizer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = Saleswoman
        fields = ['saleswoman_id','administrator','first_name','last_name','email','phone','status','username','role','created_at', 'password']
        read_only_fields = ['saleswoman_id', 'administrator', 'created_at']


    #validaciones de los campos

    def validate_phone(self, value):
        if len(value) > 15:
           raise serializers.ValidationError("El numero de telefono debe de cumplir este formato ej. 0412-000.00.00")
        return value
    
    def validate_password(self, value):
        if len(value) < 6:
           raise serializers.ValidationError("la clave debe de tener al menos 6 digitos")
        return value
    
    def validate_username(self, value):
        User = get_user_model()
        
        user_exists = User.objects.filter(username = value)
        if self.instance:
            raise serializers.ValidationError("Este nombre de usuario ya esta registrado")
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



    def create(self, validated_data):
        """ 
        En esta funcion se extrae la clave antes de que se cree la vendedora luego se crea con lo que quedo 
        creamos la vendedora esto activa el signal que a su ves crea el User, luego busca el User creado y 
        le asigna la clave real,  o sea guarda en User no en la vendedora la clave
        """
        password = validated_data.pop('password') 
    
        with transaction.atomic():
            saleswoman = Saleswoman.objects.create(**validated_data)
            
            user = User.objects.get(email = saleswoman.email)
            user.set_password(password)
            user.save()

            return saleswoman

class AdministratorSerialeizer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = Administrator
        fields = ['administrator_id','first_name','last_name','email','username','role','created_at', 'password']
        read_only_fields = ['administrator_id', 'created_at']


    #validaciones de los campos




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


