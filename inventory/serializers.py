from rest_framework import serializers
from .models import Fabric_Type, Fabric_Scrap

class FabricTypeSerializer(serializers.ModelSerializer): 

    def validate_name(self, value):
        if "." in value.lower():
            raise serializers.ValidationError("Nombre no permitido")
        
        if "basura" in value.lower():
            raise serializers.ValidationError("El nombre contiene lenguaje no permitido")
        
        if len(value) > 2:
            raise serializers.ValidationError("El nombre debe de tener minimo 3 caracteres")

        return value.strip().lower()

    def validate_material_type(self, value):
        return value.strip().lower()
    
    def validate_description(self, value):
        return value.strip() if value else value

    class Meta:
        model = Fabric_Type
        fields = ['Fabric_Type_id', 'name', 'material_type', 'description', 'last_update_at', 'registered_at']


class FabricScrapSerializer(serializers.ModelSerializer):

    fabric_type = FabricTypeSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    created_by_role = serializers.CharField(read_only=True)

    fabric_type_id = serializers.PrimaryKeyRelatedField(
        queryset=Fabric_Type.objects.all(),
        source='fabric_type',
        write_only=True
    )

    def validate_description(self, value):
        return value.strip() if value else value

    def validate_length_meters(self, value):
        if value < 0.1:
            raise serializers.ValidationError("La Longitud minima es de 0.1 metros.")
        return value
    
    def validate_width_meters(self, value):
        if value < 0.1:
            raise serializers.ValidationError("La Longitud minima es de 0.1 metros.")
        return value

    class Meta:
        model = Fabric_Scrap
        fields = ['fabric_scrap_id', 'fabric_type_id', 'fabric_type' ,'length_meters', 'width_meters', 'description', 'historial_price', 'active', 'created_by_role' ,'created_by','sale_date', 'last_update_at', 'registered_at']


