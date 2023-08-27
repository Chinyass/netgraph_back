from rest_framework import serializers
from .models import Node


class NodeSerializer(serializers.ModelSerializer):  # create class to serializer model
    class Meta:
        model = Node
        fields = '__all__'
