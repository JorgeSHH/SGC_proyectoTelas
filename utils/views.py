from django.shortcuts import render
from rest_framework.views import APIView
from .utils import guardar_pdf_referencial
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
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