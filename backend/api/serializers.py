from django.contrib.auth.models import User
from rest_framework import serializers
from ocorrencia.models import *


class UserSerializer(serializers.ModelSerializer):
    # ocorrencias = serializers.PrimaryKeyRelatedField(many=True, queryset=Ocorrencia.objects.all())
    User._meta.get_field('email')._unique = True
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name')  # 'ocorrencias'
        extra_kwargs = {'password': {'write_only': True}}

    # validacao de dados e encriptacao de password
    def create(self, validated_data):
        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['email'],
            email=validated_data['first_name'] + ' ' + validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class PessoaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pessoa
        fields = ('id', 'nome', 'sexo', 'idade', 'etnia', 'altura', 'peculiaridades')

    # def create(self, validated_data):
    #     return Pessoa.objects.create(**validated_data)


class AnimalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Animal
        fields = ('id', 'nome', 'sexo', 'idade', 'especie', 'raca', 'cor_primaria')

    # def create(self, validated_data):
    #     return Animal.objects.create(**validated_data)


class ObjetoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Objeto
        fields = ('id', 'tipo', 'cor_primaria')

    # def create(self, validated_data):
    #     print validated_data
    #     return Objeto.objects.create(**validated_data)


class ImagemSerializer(serializers.ModelSerializer):
    datafile = serializers.FileField(required=False)

    class Meta:
        model = Imagem
        fields = ('id', 'datafile')


class OcorrenciaSerializer(serializers.ModelSerializer):
    pessoa = PessoaSerializer(required=False)
    animal = AnimalSerializer(required=False)
    objeto = ObjetoSerializer(required=False)
    datafile = serializers.CharField(required=False),
    oldfileId = serializers.IntegerField(required=False),
    solucionado = serializers.BooleanField(required=False)
    owner = serializers.IntegerField(source='owner.id', required=False)

    class Meta:
        model = Ocorrencia
        fields = ('id', 'data_criacao', 'dataehora', 'categoria', 'fileId', 'oldfileId', 'telefone', 'bo',
                  'solucionado', 'dataSolucao', 'pin', 'titulo', 'tipo', 'detalhes', 'recompensa',
                  'latitude', 'longitude', 'endereco', 'cidade', 'estado', 'pais', 'pessoa',
                  'animal', 'objeto', 'datafile', 'owner')
        extra_kwargs = {
            "id": {
                "read_only": False,
                "required": False,
            },
            "owner": {
                "read_only": True,
                "required": False,
            },
        }

    def create(self, validated_data):
        pessoa_data = validated_data.pop('pessoa')
        animal_data = validated_data.pop('animal')
        objeto_data = validated_data.pop('objeto')
        # caso receba id da ocorrencia (ja criado, tela de edit)
        ocorrenciaId = self.data.get('id', None)
        if ocorrenciaId is not None:
            filter_args = {}
            for p in self.data:
                print p
                if p == "owner":
                    filter_args[p] = User.objects.get(id=self.data.get(p))
                else:
                    filter_args[p] = self.data.get(p)
            print filter_args
            if self.data['datafile'] != 'media/imagens/default.jpg' and self.data['fileId'] != self.data['oldfileId']:
                Imagem.delete(Imagem.objects.get(id=self.data['oldfileId']))
            ocorrencia = Ocorrencia.objects.update_or_create(id=self.data['id'], defaults=filter_args)
            if validated_data['categoria'] == 1:
                filter_args = {}
                for p in self.data['pessoa']:
                    print p
                    filter_args[p] = self.data['pessoa'].get(p)
                Pessoa.objects.update_or_create(ocorrencia_id=self.data['id'], defaults=filter_args)
            if validated_data['categoria'] == 2:
                filter_args = {}
                for p in self.data['animal']:
                    filter_args[p] = self.data['animal'].get(p)
                print filter_args
                Animal.objects.update_or_create(ocorrencia_id=self.data['id'], defaults=filter_args)
            if validated_data['categoria'] == 3:
                filter_args = {}
                for p in self.data['objeto']:
                    filter_args[p] = self.data['objeto'].get(p)
                Objeto.objects.update_or_create(ocorrencia_id=self.data['id'], defaults=filter_args)

        # cria novos itens
        else:
            ocorrencia = Ocorrencia.objects.create(**validated_data)
            print ocorrencia
            if validated_data['categoria'] == 1:
                Pessoa.objects.create(ocorrencia=ocorrencia, **pessoa_data)
            if validated_data['categoria'] == 2:
                Animal.objects.create(ocorrencia=ocorrencia, **animal_data)
            if validated_data['categoria'] == 3:
                Objeto.objects.create(ocorrencia=ocorrencia, **objeto_data)

        return ocorrencia


class ContatoSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    mensagem = serializers.CharField(required=True)
    assunto = serializers.CharField(required=True)
    owner = serializers.CharField(required=False)
    url = serializers.CharField(required=False)

    class Meta:
        model = Ocorrencia
        fields = ('email', 'mensagem', 'assunto', 'owner', 'url')


class SolucionadoSerializer(serializers.Serializer):

    class Meta:
        model = Ocorrencia
        fields = 'id'


class OcorrenciaFiltersSerializer(serializers.Serializer):
    pessoa = PessoaSerializer(required=False)
    animal = AnimalSerializer(required=False)
    objeto = ObjetoSerializer(required=False)
    titulo = serializers.CharField(required=False)
    tipo = serializers.CharField(required=False)
    pin = serializers.CharField(required=False)
    id = serializers.IntegerField(required=False)
    dataehora = serializers.DateTimeField(required=False)
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)



    class Meta:
        model = Ocorrencia