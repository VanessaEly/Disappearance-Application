from django.contrib.auth.models import User
from rest_framework import serializers
from ocorrencia.models import *


class UserSerializer(serializers.ModelSerializer):
    # ocorrencias = serializers.PrimaryKeyRelatedField(many=True, queryset=Ocorrencia.objects.all())
    User._meta.get_field('username')._unique = True
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name')  # 'ocorrencias'
        extra_kwargs = {'password': {'write_only': True}}

    # validacao de dados e encriptacao de password
    def create(self, validated_data):
        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class OcorrenciaSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='item.id', required=False)

    class Meta:
        model = Ocorrencia
        fields = ('id', 'data_criacao', 'dataehora', 'titulo', 'tipo',
                  'detalhes', 'recompensa', 'latitude', 'longitude', 'endereco', 'item')
        read_only_fields = ('item',)

    # def create(self, validated_data):
    #     return Ocorrencia.objects.create(**validated_data)


class PessoaSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='item.id', required=False)

    class Meta:
        model = Pessoa
        fields = ('id', 'nome', 'sexo', 'idade', 'etnia', 'altura', 'peculiaridades', 'item')

    # def create(self, validated_data):
    #     return Pessoa.objects.create(**validated_data)


class AnimalSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='item.id', required=False)

    class Meta:
        model = Animal
        fields = ('id', 'nome', 'sexo', 'idade', 'especie', 'raca', 'cor_primaria', 'item')

    # def create(self, validated_data):
    #     return Animal.objects.create(**validated_data)


class ObjetoSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='item.id', required=False)

    class Meta:
        model = Objeto
        fields = ('id', 'tipo', 'cor_primaria', 'item')

    # def create(self, validated_data):
    #     print validated_data
    #     return Objeto.objects.create(**validated_data)


class ImagemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Imagem
        fields = ('id', 'datafile')


class ItemSerializer(serializers.ModelSerializer):
    ocorrencia = OcorrenciaSerializer(required=False)
    pessoa = PessoaSerializer(required=False)
    animal = AnimalSerializer(required=False)
    objeto = ObjetoSerializer(required=False)

    class Meta:
        model = Item
        fields = ('id', 'data_criacao', 'categoria', 'ocorrencia', 'pessoa', 'animal', 'objeto', 'fileId')

    def create(self, validated_data):
        ocorrencia_data = validated_data.pop('ocorrencia')
        pessoa_data = validated_data.pop('pessoa')
        animal_data = validated_data.pop('animal')
        objeto_data = validated_data.pop('objeto')

        item = Item.objects.create(**validated_data)

        Ocorrencia.objects.create(item=item, **ocorrencia_data)
        if validated_data['categoria'] == 1:
            Pessoa.objects.create(item=item, **pessoa_data)
        if validated_data['categoria'] == 2:
            Animal.objects.create(item=item, **animal_data)
        if validated_data['categoria'] == 3:
            Objeto.objects.create(item=item, **objeto_data)
        return item


