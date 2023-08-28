from rest_framework import serializers
from .models import Node,Edge,Map

class NodeSerializer(serializers.ModelSerializer):  # create class to serializer model
    model = serializers.CharField(source='model.name')
    class Meta:
        model = Node
        fields = ('id','ip','name','hostname','mac','uplink','ro_community','rw_community','model')

class EdgeSerializer(serializers.ModelSerializer):  # create class to serializer model
    class Meta:
        model = Edge
        fields = '__all__'

class MapManySerializer(serializers.ModelSerializer):
    nodes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    edges = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Map
        fields = ('id', 'nodes', 'edges', 'name')

class MapSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=True)
    edges = EdgeSerializer(many=True, read_only=True)

    class Meta:
        model = Map
        fields = ('id', 'nodes', 'edges', 'name')
