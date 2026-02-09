from rest_framework import serializers
from .models import Dollar_Rate
from decimal import Decimal

class DollarRateSerializer(serializers.ModelSerializer):

    def validate_origin(self, value):
        return value.strip().lower() if value else value
    
    def validate_rate(self, value):
        if value <= Decimal('0'):
            raise serializers.ValidationError("La tasa debe ser un valor positivo.")
        return value
    class Meta:
        model = Dollar_Rate
        fields = ['id', 'origin', 'rate', 'last_updated', 'created_at']
        read_only_fields = ['id', 'last_updated', 'created_at']