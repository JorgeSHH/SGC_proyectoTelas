from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Saleswoman,Administrator
from .serialeizers import SaleswomanSerialeizer, AdministratorSerialeizer
from django.contrib.auth import get_user_model
from django.db import transaction
from .permissions import IsAdministrator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from audit.mixins import AuditMixins
from django.forms.models import model_to_dict

# Create your views here.

class SaleswomanViewSet(viewsets.ModelViewSet, AuditMixins):
    queryset = Saleswoman.objects.all()
    serializer_class = SaleswomanSerialeizer

# metodo para los permisos
    
    #solo administradores podran hacer CRUD a esta vista
    def get_permissions(self):
        return [IsAdministrator()]
    
    # verifica si esta autentificado y adicional a eso si es admin y solo devuelve de ser asi, de lo contrario nada 
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return Saleswoman.objects.all()
        return Saleswoman.objects.none()

#Metodos del CRUD y el el registro en auditoria(ganchos)

    # este metodo asegura que tambien se borre de la tabla secundaria User
    def perform_destroy(self, instance):
        """ este metodo asegura que se elimine en user lo que se eliminane en Saleswoman"""
        old_data = model_to_dict(instance)
        self.log_action(
            admin=self.request.user,
            action_type='DELETE',
            instance= instance,
            old_data= old_data
                        
        )
        User = get_user_model()
        with transaction.atomic():
            User.objects.filter(email = instance.email).delete()
            instance.delete()
        
        

    def perform_create(self, serializer):
        """este metodo guarda la vendedora y lo registra en la auditoria"""
        instancia = serializer.save() # aqui se guarda la vendedora
        self.log_action(admin=self.request.user, action_type='CREATE', instance=instancia)  # aqui se registra en  la auditoria
    
    def perform_update(self, serializer):
        """"""
        old_instance = self.get_object() # aqui se guarda los dato viejos  para el atributo de 
        old_data = model_to_dict(old_instance)

        instancia = serializer.save()

        self.log_action(
            admin=self.request.user,
            action_type = 'UPDATE',
            instance = instancia,
            old_data= old_data #ojo aqui la old_data es de lo de arriba uno es el atributo y otra la asignada al atributo
        )

class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerialeizer
    permission_classes = [IsAdministrator]

    def perform_destroy(self, instance):
        """ este metodo asegura que se elimine en user lo que se eliminane en Saleswoman"""
        User = get_user_model()
        with transaction.atomic():
            User.objects.filter(email = instance.email).delete()
            instance.delete()

class MiTokenObtainPairSerialeizer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.EmailField() # no buscara el campo username para la validadacion sino email

    @classmethod
    def get_token(cls, user):
        """Funcion para guardar los datos del token encriptado"""
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        return token
    def validate(self, attrs):
        """ Validacion de las credenciales"""
        data = super().validate(attrs) # el attrs ese es donde estara el email y el password, aui mismo se hace la validacion

        # parte de la respuesta al frotend recordarles que deben de guardar esto
        data['user'] = {
            'email': self.user.email,
            'username': self.user.username,
            'role': self.user.role,
            'status': self.user.is_active
        }
        return data
    

