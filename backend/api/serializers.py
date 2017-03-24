from django.contrib.auth.models import User, Group
from rest_framework import serializers
from informe.models import Informe


class UserSerializer(serializers.ModelSerializer):
    informes = serializers.PrimaryKeyRelatedField(many=True, queryset=Informe.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'informes')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class InformeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Informe
        fields = ('id', 'data_criacao', 'titulo', 'descricao', 'coordenadas', 'owner')


class InformeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')
    data_criacao = serializers.CharField(read_only=True)
    titulo = serializers.CharField(required=True, allow_blank=False, max_length=100)
    descricao = serializers.CharField(required=True, max_length=400, allow_blank=False)
    coordenadas = serializers.CharField(required=True, max_length=30, allow_blank=False)

    def create(self, validated_data):
        # Cria e retorna uma instancia de novoInforme, dados os dados validados
        return Informe.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Atualiza e retorna uma instancia de novoInforme, dados os dados validados
        instance.data_criacao = validated_data.get('data_criacao', instance.data_criacao)
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.descricao = validated_data.get('descricao', instance.descricao)
        instance.coordenadas = validated_data.get('coordenadas', instance.coordenadas)
        instance.owner = validated_data.get('owner', instance.owner)
        instance.save()
        return instance
