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
from rest_framework import filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.

class SaleswomanViewSet(viewsets.ModelViewSet, AuditMixins):
    queryset = Saleswoman.objects.all()
    serializer_class = SaleswomanSerialeizer

# configuracion para los filtros

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['saleswoman_id', 'email']#busqueda especifica
    search_fields = ['first_name','last_name','email','username'] #busqueda mas grande no taan especifica

# metodos de personalizacion de respuestas para enviar algo al frotend antes que nada

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception= True)
        self.perform_create(serializer)
        return Response({
            "status":"success",
            "message": "Vendedora registrada exitosamente en el sistema",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        parcial = kwargs.pop('partial', False)
        instancia = self.get_object()
        serializer = self.get_serializer(instancia, data=request.data, partial = parcial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "status":"success",
            "message": "Datos de la vendedora actualizados correctamente.",
            "data": serializer.data
        })

    def destroy(self, request, *arg, **kwargs):
        instance = self.get_object()
        email_borrado = instance.email
        self.perform_destroy(instance)
        return Response({
            "status":"success",
            "message": f"La vendedora con email {email_borrado} ha sido eliminada de forma permanente.",
        }, status=status.HTTP_200_OK)


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

        try:
            admin_profile = Administrator.objects.get(email=self.request.user.email)
        except Administrator.DoesNotExist:
            raise serializers.ValidationError({"detail": "El usuario logueado no tiene un perfil de administrador válido."})

        self.log_action(
            admin=admin_profile,
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
        try:
            admin_profile = Administrator.objects.get(email=self.request.user.email)
        except Administrator.DoesNotExist:
            raise serializers.ValidationError({"detail": "El usuario logueado no tiene un perfil de administrador válido."})
        
        password_plana = self.request.data.get('password')

        instancia = serializer.save(administrator = admin_profile)# aqui se guarda la vendedora

        self.log_action(admin=admin_profile, action_type='CREATE', instance=instancia)  # aqui se registra en  la auditoria

        try:
            from utils.utils import enviar_correo_bienvenida
            enviar_correo_bienvenida(instancia.email, instancia.first_name, password_plana)
        except Exception as e:
            print(f"Error enviando correo: {e}")
    
    def perform_update(self, serializer):
        """"""
        old_instance = self.get_object() # aqui se guarda los dato viejos  para el atributo de 
        old_data = model_to_dict(old_instance)

        try:
            admin_profile = Administrator.objects.get(email=self.request.user.email)
        except Administrator.DoesNotExist:
            raise serializers.ValidationError({"detail": "El usuario logueado no tiene un perfil de administrador válido."})

        instancia = serializer.save()

        self.log_action(
            admin=admin_profile,
            action_type = 'UPDATE',
            instance = instancia,
            old_data= old_data #ojo aqui la old_data es de lo de arriba uno es el atributo y otra la asignada al atributo
        )

class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerialeizer
    permission_classes = [IsAdministrator]


# metodos de personalizacion de respuestas para enviar algo al frotend antes que nada

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception= True)
        self.perform_create(serializer)
        return Response({
            "status":"success",
            "message": "Administrador registrado exitosamente en el sistema",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        parcial = kwargs.pop('partial', False)
        instancia = self.get_object()
        serializer = self.get_serializer(instancia, data=request.data, partial = parcial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "status":"success",
            "message": "Perfil de administrador actualizado correctamente.",
            "data": serializer.data
        })

    def destroy(self, request, *arg, **kwargs):
        instance = self.get_object()
        email_borrado = instance.email
        self.perform_destroy(instance)
        return Response({
            "status":"success",
            "message": f"El administrador {email_borrado} ha sido eliminado y sus vendedoras reasignadas.",
        }, status=status.HTTP_200_OK)


    def perform_create(self, serializer):
        """
        guarda el admin y envia correo de bienbenida
        """
        password_plata = self.request.data.get('password')
        instancia = serializer.save()

        try:
            from utils.utils import enviar_correo_bienvenida
            enviar_correo_bienvenida(instancia.email, instancia.first_name, password_plata)
        except Exception as e:
            print(f"Error enviando correo al adminastrador: {e}")

    def perform_destroy(self, instance):
        """ 
        este metodo asegura que se elimine en user lo que se eliminane en 
        anministrator, y que se reasignen las vendedoras a el admin que 
        ejecuta la accion de eliminar, para no dejar en null los campos 
        de las saleswoman por parte de administrator_id
        """
        User = get_user_model()

        try:
            heredero = Administrator.objects.get(email = self.request.user.email)
        except Administrator.DoesNotExist:
            raise serializers.ValidationError({"detail":"No tiene un perfil de administrator válido para realizar esta accion."})

        if heredero == instance:
            raise serializers.ValidationError({"detail":"No puedes eliminat tu propio perfil de administrador."})

        with transaction.atomic():
            
            vendedora_a_tranferir = Saleswoman.objects.filter(administrator = instance)
            
            vendedora_a_tranferir.update(administrator = heredero)

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
    

