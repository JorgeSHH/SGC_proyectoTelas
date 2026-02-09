from rest_framework import serializers
from .models import Fabric_Type, Fabric_Scrap
# ✅ IMPORTANTE: El import debe estar al principio del archivo
from users.models import Saleswoman

class FabricTypeSerializer(serializers.ModelSerializer): 

    def validate_name(self, value):
        name = value.strip().lower()
        symbols = ['.', '-', '_', '/', '*', '#']
        for symbol in symbols:
            if symbol in name:
                raise serializers.ValidationError("Nombre no permitido")
        if "basura" in name:
            raise serializers.ValidationError("El nombre contiene lenguaje no permitido")
        if len(name) < 3:
            raise serializers.ValidationError("El nombre debe de tener minimo 3 caracteres")
        return name

    def validate_material_type(self, value):
        material_type = value.strip().lower()
        symbols = ['.', '-', '_', '/', '*', '#']
        for symbol in symbols:
            if symbol in material_type:
                raise serializers.ValidationError("Nombre no permitido")
        return material_type
    
    def validate_description(self, value):
        return value.strip() if value else value

    class Meta:
        model = Fabric_Type
        fields = ['Fabric_Type_id', 'name', 'material_type', 'description', 'price_unit', 'qr', 'last_update_at', 'registered_at']
        read_only_fields = ['created_at']


class FabricScrapSerializer(serializers.ModelSerializer):

    fabric_type = FabricTypeSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    created_by_role = serializers.CharField(read_only=True)

    fabric_type_id = serializers.PrimaryKeyRelatedField(
        queryset=Fabric_Type.objects.all(),
        source='fabric_type',
        write_only=True
    )

    # ✅ AGREGADO: Campo para editar la vendedora (write_only)
    created_by_id = serializers.PrimaryKeyRelatedField(
        queryset=Saleswoman.objects.all(),
        source='created_by',
        write_only=True
    )

    def validate_description(self, value):
        return value.strip() if value else value

    def validate_length_meters(self, value):
        length_meters = value
        if length_meters < 0.15:
            raise serializers.ValidationError("La Longitud minima es de 0.15 metros.")
        return length_meters
    
    def validate_width_meters(self, value):
        width_meters = value
        if width_meters < 0.15:
            raise serializers.ValidationError("La Longitud minima es de 0.15 metros.")
        return width_meters

    class Meta:
        model = Fabric_Scrap
        # ✅ AGREGADO: 'created_by_id' para permitir enviar el ID
        fields = ['fabric_scrap_id', 'created_by_id', 'fabric_type_id', 'fabric_type' ,'length_meters', 'width_meters', 'description', 'active', 'qr','created_by_role' ,'created_by', 'historial_price','sale_date', 'last_update_at', 'registered_at']
        read_only_fields = ['created_at', 'historial_price']


class FabricScrapStatsSerializer(serializers.Serializer):
    fabric_type__name = serializers.CharField()
    total = serializers.IntegerField()

class SaleswomanStatsSerializer(serializers.Serializer):
    created_by__username = serializers.CharField()
    total = serializers.IntegerField()

class BulkDesactivarScrapsSerializer(serializers.Serializer):
    scrap_ids = serializers.ListField(
        child = serializers.IntegerField(),
        allow_empty = False
    )