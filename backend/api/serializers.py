from django.contrib.auth.models import User
from rest_framework import serializers
from ocorrencia.models import Ocorrencia
from rest_framework.validators import UniqueTogetherValidator


class UserSerializer(serializers.ModelSerializer):
    # ocorrencias = serializers.PrimaryKeyRelatedField(many=True, queryset=Ocorrencia.objects.all())
    email = serializers.CharField(required=True, allow_blank=False, max_length=100)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')  # 'ocorrencias'
        extra_kwargs = {'password': {'write_only': True}}
        validators = [
            UniqueTogetherValidator(
                queryset=User.objects.all(),
                fields=('username', 'email')
            )
        ]


class OcorrenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ocorrencia
        fields = ('id', 'data_criacao', 'titulo', 'descricao', 'coordenadas', 'owner')


class OcorrenciaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')
    data_criacao = serializers.CharField(read_only=True)
    titulo = serializers.CharField(required=True, allow_blank=False, max_length=100)
    descricao = serializers.CharField(required=True, max_length=400, allow_blank=False)
    coordenadas = serializers.CharField(required=True, max_length=30, allow_blank=False)

    def create(self, validated_data):
        # Cria e retorna uma instancia de novoocorrencia, dados os dados validados
        return Ocorrencia.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Atualiza e retorna uma instancia de novoocorrencia, dados os dados validados
        instance.data_criacao = validated_data.get('data_criacao', instance.data_criacao)
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.descricao = validated_data.get('descricao', instance.descricao)
        instance.coordenadas = validated_data.get('coordenadas', instance.coordenadas)
        instance.owner = validated_data.get('owner', instance.owner)
        instance.save()
        return instance
