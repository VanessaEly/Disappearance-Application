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
    ocorrencia = serializers.CharField(source='ocorrencia.id', required=False)

    class Meta:
        model = Pessoa
        fields = ('id', 'nome', 'sexo', 'idade', 'etnia', 'altura', 'peculiaridades', 'ocorrencia')

    # def create(self, validated_data):
    #     return Pessoa.objects.create(**validated_data)


class AnimalSerializer(serializers.ModelSerializer):
    ocorrencia = serializers.CharField(source='ocorrencia.id', required=False)

    class Meta:
        model = Animal
        fields = ('id', 'nome', 'sexo', 'idade', 'especie', 'raca', 'cor_primaria', 'ocorrencia')

    # def create(self, validated_data):
    #     return Animal.objects.create(**validated_data)


class ObjetoSerializer(serializers.ModelSerializer):
    ocorrencia = serializers.CharField(source='ocorrencia.id', required=False)

    class Meta:
        model = Objeto
        fields = ('id', 'tipo', 'cor_primaria', 'ocorrencia')

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
    owner = serializers.CharField(source='owner.id', required=False)
    bo = serializers.BooleanField(required=False)
    solucionado = serializers.BooleanField(required=False)

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
        }

    def create(self, validated_data):
        pessoa_data = validated_data.pop('pessoa')
        animal_data = validated_data.pop('animal')
        objeto_data = validated_data.pop('objeto')
        # caso receba id da ocorrencia (ja criado, tela de edit)
        ocorrenciaId = self.data.get('id', None)
        if ocorrenciaId is not None:
            Imagem.delete(Imagem.objects.get(id=self.data['oldfileId']))
            ocorrencia = Ocorrencia.objects.update_or_create(id=self.data['id'], defaults={
                'categoria': self.data['categoria'],
                'fileId': self.data['fileId'],
                'pin': self.data['pin'],
                'datafile': self.data['datafile'],
                'telefone': self.data['telefone'],
                'solucionado': self.data['solucionado'],
                'dataSolucao': self.data['dataSolucao'],
                'dataehora': self.data['dataehora'],
                'titulo': self.data['titulo'],
                'tipo': self.data['tipo'],
                'detalhes': self.data['detalhes'],
                'recompensa': self.data['recompensa'],
                'latitude': self.data['latitude'],
                'longitude': self.data['longitude'],
                'endereco': self.data['endereco'],
                'cidade': self.data['cidade'],
                'estado': self.data['estado'],
                'pais': self.data['pais']
            })
            if validated_data['categoria'] == 1:
                Pessoa.objects.update_or_create(ocorrencia_id=self.data['id'], defaults={
                    'nome': self.data['pessoa']['nome'],
                    'sexo': self.data['pessoa']['sexo'],
                    'idade': self.data['pessoa']['idade'],
                    'etnia': self.data['pessoa']['etnia'],
                    'altura': self.data['pessoa']['altura'],
                    'peculiaridades': self.data['pessoa']['peculiaridades'],
                })
            if validated_data['categoria'] == 2:
                Animal.objects.update_or_create(ocorrencia_id=self.data['id'], defaults={
                    'nome': self.data['animal']['nome'],
                    'sexo': self.data['animal']['sexo'],
                    'idade': self.data['animal']['idade'],
                    'especie': self.data['animal']['especie'],
                    'raca': self.data['animal']['raca'],
                    'cor_primaria': self.data['animal']['cor_primaria'],
                })
            if validated_data['categoria'] == 3:
                Objeto.objects.update_or_create(ocorrencia_id=self.data['id'], defaults={
                    'tipo': self.data['objeto']['tipo'],
                    'cor_primaria': self.data['objeto']['cor_primaria'],
                })

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
