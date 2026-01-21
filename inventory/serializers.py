from rest_framework import serializers
from .models import Fabric_Type, Fabric_Scrap

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

    def validate_description(self, value):
        return value.strip() if value else value

    def validate_length_meters(self, value):

        length_meters = value

        if length_meters < 0.1:
            raise serializers.ValidationError("La Longitud minima es de 0.1 metros.") #10cm
        return length_meters
    
    def validate_width_meters(self, value):

        width_meters = value

        if width_meters < 0.1:
            raise serializers.ValidationError("La Longitud minima es de 0.1 metros.") #10cm
        return width_meters

    class Meta:
        model = Fabric_Scrap
        fields = ['fabric_scrap_id', 'fabric_type_id', 'fabric_type' ,'length_meters', 'width_meters', 'description', 'active', 'qr','created_by_role' ,'created_by', 'historial_price','sale_date', 'last_update_at', 'registered_at']
        read_only_fields = ['created_at', 'historial_price']


