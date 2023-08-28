from django.db import models

class DeviceModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)

class Node(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    ip = models.GenericIPAddressField()
    name = models.CharField(max_length=100,default=None,blank=True)
    hostname = models.CharField(max_length=100,default=None,null=True,blank=True) #DNS name
    model = models.ForeignKey(DeviceModel, related_name='model',on_delete=models.SET_NULL,null=True)
    mac = models.CharField(max_length=100,default=None,null=True,blank=True)
    uplink = models.IntegerField(default=None,null=True,blank=True)
    ro_community = models.CharField(max_length=100,default=None,null=True,blank=True)
    rw_community = models.CharField(max_length=100,default=None,null=True,blank=True)

    def __str__(self):
        return f'{self.name} {self.ip}'

class Edge(models.Model):
    source = models.ForeignKey(Node, related_name='source',on_delete=models.CASCADE)
    source_port = models.IntegerField()
    target = models.ForeignKey(Node, related_name='target',on_delete=models.CASCADE)
    target_port = models.IntegerField()

    def __str__(self):
        return f'{self.source.name} {self.source_port} to {self.target.name} {self.target_port}'

class Map(models.Model):
    nodes = models.ManyToManyField(Node)
    edges = models.ManyToManyField(Edge)
    name = models.CharField(max_length=100)
    def __str__(self):
        return f'Map: {self.id}'