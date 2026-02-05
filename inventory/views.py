from django.shortcuts import render
from django.db.models import ProtectedError
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Fabric_Scrap, Fabric_Type
from .serializers import FabricScrapSerializer,FabricTypeSerializer, BulkDesactivarScrapsSerializer
from .permissions import IsAdministrator, IsSaleswoman
from rest_framework.permissions import IsAuthenticated
from django.forms.models import model_to_dict
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from audit.mixins import AuditMixins
from users.models import Administrator
from .utils import generar_codigo_qr
from django.http import FileResponse, Http404
from rest_framework.views import APIView
from django.conf import settings
from django.db.models import Count
from rest_framework.decorators import action
from django.db.models.functions import TruncWeek
from django.db import transaction
from django.utils import timezone
from decimal import Decimal, ROUND_HALF_UP
import os 


class FabricScrapViewSet(viewsets.ModelViewSet, AuditMixins):
    queryset = Fabric_Scrap.objects.all() 
    serializer_class = FabricScrapSerializer

    #filtros de busqueda

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['fabric_scrap_id']
    search_fields = ['description', 'fabric_scrap_id', 'active']
    ordering_fields = ['fabric_scrap_id']


    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [IsAdministrator()]
        return [(IsAuthenticated & (IsAdministrator | IsSaleswoman ))()]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_authenticated and (user.role == 'admin' or user.role == 'saleswoman'):
            return Fabric_Scrap.objects.all()
        #filter(created_by=user)   
        return Fabric_Scrap.objects.none()
    
   
    # respuestas personalizadas

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "Datos del retazo inválidos.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        return Response({
            "status": "success",
            "message": "Retazo registrado exitosamente.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "No se pudo actualizar el retazo.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
     
        self.perform_update(serializer)
        return Response({
            "status": "success",
            "message": "Datos del retazo actualizados.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        id_retazo = instance.fabric_scrap_id
        self.perform_destroy(instance)
        
        return Response({
            "status": "success",
            "message": f"El retazo con ID {id_retazo} ha sido eliminado del inventario."
        }, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        user = self.request.user

        retazo = serializer.save(
            created_by=user,
            created_by_role=getattr(user, 'role', 'no_role') 
        )

        nombre_qr = generar_codigo_qr(retazo.fabric_scrap_id, prefijo="retazo")

        retazo.qr = nombre_qr
        retazo.save()
        serializer.instance = retazo
    

    # ganchos para guardar en el log 

    # def perform_update(self, serializer):
    #     instance = self.get_object()
    #     old_data = model_to_dict(instance)

    #     try:
    #         admin_profile = Administrator.objects.get(email=self.request.user.email)
    #     except Administrator.DoesNotExist:
    #         raise serializers.ValidationError({"detail": "El usuario logueado no tiene un perfil de administrador válido."})
        
    #     updated_instance = serializer.save()

    #     self.log_action(
    #         admin=admin_profile, 
    #         action_type='UPDATE', 
    #         instance=updated_instance, 
    #         old_data=old_data
    #     )

    # def perform_destroy(self, instance):
    #     user = self.request.user
    #     old_data = model_to_dict(instance)

    #     self.log_action(admin=user, action_type='DELETE', instance=instance, old_data=old_data)
        
    #     instance.delete()



class FabricTypeViewSet(viewsets.ModelViewSet):
    queryset = Fabric_Type.objects.all()
    serializer_class = FabricTypeSerializer

    #filtros de busqueda

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['Fabric_Type_id', 'name', 'material_type']
    search_fields = ['name', 'material_type']
    ordering_fields = ['name', 'Fabric_Type_id']
    ordering = ['name']


    #  permisos
    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update', 'create']:
            return [IsAdministrator()]
        return [(IsAuthenticated & (IsAdministrator | IsSaleswoman))()] 
    
    # respuestas personalizadas
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "Nombre de tipo de tela inválido o duplicado",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        return Response({
            "status": "success",
            "message": "Nuevo tipo de tela creado",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "No se pudo actualizar el tipo de tela.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response({
            "status": "success",
            "message": "Tipo de tela actualizado exitosamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            nombre_tela = instance.name
            # Intentamos realizar el borrado normal
            self.perform_destroy(instance)
            return Response({
                "status": "success",
                "message": f"Tipo de tela '{nombre_tela}' eliminado correctamente."
            }, status=status.HTTP_200_OK)
        except ProtectedError as e:
            # Capturamos el error de protección
            return Response({
                    "status": "error",
                    "message": "Acción bloqueada, No se puede eliminar porque existen retazos asociados a este tipo de tela.",
                    "errors": {"detail": str(e)}
                }, status=status.HTTP_400_BAD_REQUEST)
        
    def perform_create(self, serializer):
        tipo_tela = serializer.save()

        nombre_qr = generar_codigo_qr(tipo_tela.Fabric_Type_id, prefijo= "tipo")

        tipo_tela.qr = nombre_qr
        tipo_tela.save()
        serializer.instance = tipo_tela

class ServeQRView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tipo, pk):

        nombre_archivo = f"qr_{tipo}_{pk}.png"
        ruta_archivo = os.path.join(settings.MEDIA_ROOT, 'qrs', nombre_archivo)

        if os.path.exists(ruta_archivo):
            return FileResponse(open(ruta_archivo, 'rb'), content_type ="image/png")
        
        raise Http404("El QR no existe.")
    

class InventarioDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdministrator]

    @action(detail=False, methods=['get'])
    def metrics(self, request):
        # Retazos agrupados por nombre de tipo de tela
        scraps_by_type = Fabric_Scrap.objects.values('fabric_type__name').annotate(
            total=Count('fabric_scrap_id')
        ).order_by('-total')

        # Ranking histórico de vendedoras
        ranking_global = Fabric_Scrap.objects.filter(
            created_by_role='saleswoman'
        ).values('created_by__username').annotate(
            total=Count('fabric_scrap_id')
        ).order_by('-total')

        # Progreso semanal por vendedora
        progreso_semanal = Fabric_Scrap.objects.filter(
            created_by_role='saleswoman'
        ).annotate(
            semana=TruncWeek('registered_at')
        ).values('semana', 'created_by__username').annotate(
            total=Count('fabric_scrap_id')
        ).order_by('-semana')

        return Response({
            "status": "success",
            "data1": {
                "scraps_by_type": scraps_by_type
            },
            "data2": {
                "ranking_global": ranking_global,
                "progreso_semanal": progreso_semanal
            }
        })
    

class ConfirmarVentaView(APIView):
    permission_classes = [IsAuthenticated, (IsAdministrator | IsSaleswoman)]

    @transaction.atomic
    def post(self, request):
        """
        Procesa la venta masiva de retazos, calcula el precio histórico 
        y los saca de inventario.
        """
        serializer = BulkDesactivarScrapsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        scrap_ids = serializer.validated_data['scrap_ids']

        try:
            # 1. Bloqueamos las filas para evitar que otra vendedora las venda al mismo tiempo
            retazos = Fabric_Scrap.objects.select_for_update().select_related('fabric_type').filter(
                fabric_scrap_id__in=scrap_ids,
                active=True
            )

            # 2. Validación de integridad
            if retazos.count() != len(scrap_ids):
                encontrados = list(retazos.values_list('fabric_scrap_id', flat=True))
                faltantes = list(set(scrap_ids) - set(encontrados))
                return Response({
                    "status": "error",
                    "message": "Venta cancelada: Algunos retazos no están disponibles.",
                    "ids_no_disponibles": faltantes
                }, status=status.HTTP_409_CONFLICT)

            # 3. Procesamiento individual para historial_price
       
            ahora = timezone.now()
            for retazo in retazos:

                precio_calculado = ((retazo.length_meters * retazo.width_meters) * retazo.fabric_type.price_unit).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
                
                retazo.active = False
                retazo.sale_date = ahora
                retazo.historial_price = precio_calculado

                retazo.save()

            return Response({
                "status": "success",
                "message": f"Venta confirmada exitosamente. {len(scrap_ids)} retazos vendidos.",
                "total_items": len(scrap_ids)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "status": "error",
                "message": f"Error crítico en el servidor: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
