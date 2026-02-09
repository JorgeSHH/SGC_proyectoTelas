from django.shortcuts import render
from rest_framework.views import APIView
from .utils import guardar_pdf_referencial
from rest_framework import status
from django.utils import timezone
from rest_framework import viewsets, mixins
from .serializers import DollarRateSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Dollar_Rate
# Create your views here.


class UploadPDFView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        file_obj = request.FILES.get('pdf')
        if not file_obj:
            return Response({"error": "No se envió ningún archivo"}, status=400)
        

        # Opcional: Validar que sea PDF
        if not file_obj.name.endswith('.pdf'):
            return Response({"error": "El archivo no es un PDF"}, status=400)

        timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")

        nombre_limpio = file_obj.name.replace(" ", "_")
        nuevo_nombre = f"proforma_{timestamp}_{nombre_limpio}"

        # Guardamos
        try:
            ruta = guardar_pdf_referencial(file_obj, nuevo_nombre)
            
            return Response({
                "status": "success",
                "message": "PDF guardado correctamente",
                "filename": nuevo_nombre,
                "path": ruta
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                "status": "error",
                "message": f"Error al guardar el archivo: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DollarRateViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated] 

    queryset = Dollar_Rate.objects.all()
    serializer_class = DollarRateSerializer
    
    def list(self, request, *args, **kwargs):
        instance = self.get_queryset().first() # Tomamos el único valor
        if instance:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return Response({"error": "No hay tasa registrada"}, status=404)
