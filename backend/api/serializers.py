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


class OcorrenciaSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='item.id', required=False)

    class Meta:
        model = Ocorrencia
        fields = ('id', 'data_criacao', 'dataehora', 'titulo', 'tipo', 'detalhes', 'recompensa',
                  'latitude', 'longitude', 'endereco', 'cidade', 'estado', 'pais', 'item')
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
    datafile = serializers.FileField(required=False)

    class Meta:
        model = Imagem
        fields = ('id', 'datafile')


class ItemSerializer(serializers.ModelSerializer):
    ocorrencia = OcorrenciaSerializer(required=False)
    pessoa = PessoaSerializer(required=False)
    animal = AnimalSerializer(required=False)
    objeto = ObjetoSerializer(required=False)
    datafile = serializers.CharField(required=False),
    oldfileId = serializers.IntegerField(required=False),
    owner = serializers.CharField(source='owner.id', required=False)

    class Meta:
        model = Item
        fields = ('id', 'data_criacao', 'categoria', 'fileId', 'oldfileId', 'pin', 'ocorrencia', 'pessoa', 'animal', 'objeto',
                  'datafile', 'owner')

    def create(self, validated_data):
        ocorrencia_data = validated_data.pop('ocorrencia')
        pessoa_data = validated_data.pop('pessoa')
        animal_data = validated_data.pop('animal')
        objeto_data = validated_data.pop('objeto')

        # caso receba id do item (ja criado, tela de edit)
        if 'item' in self.data['ocorrencia']:
            print self.data['oldfileId']
            print self.data['fileId']
            Imagem.delete(Imagem.objects.get(id=self.data['oldfileId']))
            item = Item.objects.update_or_create(id=self.data['ocorrencia']['item'], defaults={
                'categoria': self.data['categoria'],
                'fileId': self.data['fileId'],
                'pin': self.data['pin'],
                'datafile': self.data['datafile'],
            })
            Ocorrencia.objects.update_or_create(item_id=self.data['ocorrencia']['item'], defaults={
                'dataehora': self.data['ocorrencia']['dataehora'],
                'titulo': self.data['ocorrencia']['titulo'],
                'tipo': self.data['ocorrencia']['tipo'],
                'detalhes': self.data['ocorrencia']['detalhes'],
                'recompensa': self.data['ocorrencia']['recompensa'],
                'latitude': self.data['ocorrencia']['latitude'],
                'longitude': self.data['ocorrencia']['longitude'],
                'endereco': self.data['ocorrencia']['endereco'],
                'cidade': self.data['ocorrencia']['cidade'],
                'estado': self.data['ocorrencia']['estado'],
                'pais': self.data['ocorrencia']['pais']
            })
            if validated_data['categoria'] == 1:
                Pessoa.objects.update_or_create(item_id=self.data['ocorrencia']['item'], defaults={
                    'nome': self.data['pessoa']['nome'],
                    'sexo': self.data['pessoa']['sexo'],
                    'idade': self.data['pessoa']['idade'],
                    'etnia': self.data['pessoa']['etnia'],
                    'altura': self.data['pessoa']['altura'],
                    'peculiaridades': self.data['pessoa']['peculiaridades'],
                })
            if validated_data['categoria'] == 2:
                Animal.objects.update_or_create(item_id=self.data['ocorrencia']['item'], defaults={
                    'nome': self.data['animal']['nome'],
                    'sexo': self.data['animal']['sexo'],
                    'idade': self.data['animal']['idade'],
                    'especie': self.data['animal']['especie'],
                    'raca': self.data['animal']['raca'],
                    'cor_primaria': self.data['animal']['cor_primaria'],
                })
            if validated_data['categoria'] == 3:
                Objeto.objects.update_or_create(item_id=self.data['ocorrencia']['item'], defaults={
                    'tipo': self.data['objeto']['tipo'],
                    'cor_primaria': self.data['objeto']['cor_primaria'],
                })

        # cria novos itens
        else:
            item = Item.objects.create(**validated_data)
            Ocorrencia.objects.create(item=item, **ocorrencia_data)
            if validated_data['categoria'] == 1:
                Pessoa.objects.create(item=item, **pessoa_data)
            if validated_data['categoria'] == 2:
                Animal.objects.create(item=item, **animal_data)
            if validated_data['categoria'] == 3:
                Objeto.objects.create(item=item, **objeto_data)

        return item


class ContatoSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    mensagem = serializers.CharField(required=True)
    assunto = serializers.CharField(required=True)
    owner = serializers.CharField(required=False)
    url = serializers.CharField(required=False)

    class Meta:
        model = Item
        fields = ('email', 'mensagem', 'assunto', 'owner', 'url')
