from api.serializers import *
from models import *
from rest_framework import viewsets, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from disapp import settings
import os
from django.core.mail import send_mail
from datetime import datetime
from django.utils import timezone


class OcorrenciaViewSet(viewsets.ModelViewSet):
    serializer_class = OcorrenciaSerializer

    def get_queryset(self):
        filter_args = {}
        if self.request.auth is not None:
            filter_args['owner'] = self.request.user
        for p in self.request.query_params:
            filter_args[p] = self.request.GET.get(p)
        queryset = Ocorrencia.objects.filter(**filter_args)

        for ocorrencia in queryset:
            ocorrencia.datafile = settings.MEDIA_URL + Imagem.objects.get(id=ocorrencia.fileId).datafile.__str__()
            if ocorrencia.categoria == 1:
                ocorrencia.pessoa = Pessoa.objects.get(ocorrencia_id=ocorrencia.id)
            else:
                if ocorrencia.categoria == 2:
                    ocorrencia.animal = Animal.objects.get(ocorrencia_id=ocorrencia.id)
                else:
                    ocorrencia.objeto = Objeto.objects.get(ocorrencia_id=ocorrencia.id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)  # datafile=self.request.data.get('datafile'

    def delete(self, request):

        ocorrencia_id = self.request.query_params.get('id', None)
        ocorrencia = Ocorrencia.objects.get(id=ocorrencia_id)
        if self.request.user == ocorrencia.owner:
            # deleta imagem
            try:
                imagem = Imagem.objects.get(id=ocorrencia.fileId)
                try:
                    print imagem.datafile
                    if imagem.datafile != 'imagens/default.jpg':
                        os.remove(imagem.datafile.path)
                except OSError:
                    pass
                    # return Response("Arquivo" + imagem.datafile.path + " nao encontrado")
                Imagem.delete(imagem)

            except ObjectDoesNotExist:
                return Response("Imagem nao existe")

            # deleta detalhes
            if ocorrencia.categoria == 1:
                try:
                    pessoa = Pessoa.objects.get(ocorrencia_id=ocorrencia.id)
                    Pessoa.delete(pessoa)
                except ObjectDoesNotExist:
                    return Response("Pessoa nao existe")
            elif ocorrencia.categoria == 2:
                try:
                    animal = Animal.objects.get(ocorrencia_id=ocorrencia.id)
                    Animal.delete(animal)
                except ObjectDoesNotExist:
                    return Response("Animal nao existe")
            else:
                try:
                    objeto = Objeto.objects.get(ocorrencia_id=ocorrencia.id)
                    Objeto.delete(objeto)
                except ObjectDoesNotExist:
                    return Response("Objeto nao existe")

            # deleta ocorrencia
            try:
                Ocorrencia.delete(ocorrencia)
            except ObjectDoesNotExist:
                return Response("Ocorrencia nao existe")

            return Response("Deletada com sucesso!", status=status.HTTP_200_OK)
        else:
            return Response("Apenas o criador da ocorrencia pode efetuar isto!", status=status.HTTP_401_UNAUTHORIZED)


class ImagemViewSet(viewsets.ModelViewSet):
    queryset = Imagem.objects.all()
    serializer_class = ImagemSerializer
    parser_classes = (MultiPartParser, FormParser,)

    def get_queryset(self):
        queryset = Imagem.objects.all()
        imagem = self.request.query_params.get('id', None)
        if imagem is not None:
            queryset = queryset.filter(id=imagem)
        return queryset

    def perform_create(self, serializer):
        file = self.request.data.get('datafile')
        if file is not None:
            serializer.save(datafile=file)
        else:
            serializer.save(datafile='imagens/default.jpg')


class ObjetoViewSet(viewsets.ModelViewSet):
    queryset = Objeto.objects.all()
    serializer_class = ObjetoSerializer

    def get_queryset(self):
        queryset = Objeto.objects.all()
        objeto = self.request.query_params.get('ocorrencia_id', None)
        if objeto is not None:
            queryset = queryset.filter(ocorrencia_id=objeto)
        return queryset

    def perform_create(self, serializer):
        serializer.save()


class AnimalViewSet(viewsets.ModelViewSet):
    serializer_class = AnimalSerializer

    def get_queryset(self):
        queryset = Animal.objects.all()
        animal = self.request.query_params.get('ocorrencia_id', None)
        if animal is not None:
            queryset = queryset.filter(ocorrencia_id=animal)
        return queryset

    def perform_create(self, serializer):
        serializer.save()


class PessoaViewSet(viewsets.ModelViewSet):
    serializer_class = PessoaSerializer

    def get_queryset(self):
        queryset = Pessoa.objects.all()
        pessoa = self.request.query_params.get('ocorrencia_id', None)
        if pessoa is not None:
            queryset = queryset.filter(ocorrencia_id=pessoa)
        return queryset

    def perform_create(self, serializer):
        serializer.save()


class ContatoViewSet(viewsets.ViewSet):

    def list(self, request):  # , format=None
        email = self.request.query_params.get('email', None)
        mensagem = self.request.query_params.get('mensagem', None)
        assunto = self.request.query_params.get('assunto', None)

        owner = self.request.query_params.get('owner', None)
        url = self.request.query_params.get('url', None)

        if owner is not None:
            queryset = User.objects.filter(id=owner)
            send_mail(
                assunto,
                'Mensagem recebida - ' + url + '\n\n' + mensagem + '\n\n Enviado por - ' + email,
                'Disapp<disapp.contato@gmail.com>',
                [queryset[0]],
                fail_silently=False,
            )
            return Response("success")
        else:
            if email and mensagem and assunto is not None:
                send_mail(
                    assunto,
                    mensagem + '\n\n Enviado por - ' + email,
                    'disapp.contato@gmail.com',
                    ['disapp.contato@gmail.com'],
                    fail_silently=False,
                )
                return Response("success")
            else:
                return Response("error")


class SolucionadoViewSet(viewsets.ModelViewSet):
    serializer_class = SolucionadoSerializer

    def get_queryset(self):
        queryset = Ocorrencia.objects.get(id=self.request.query_params.get('id', None))

        if queryset.solucionado is False:
            queryset.solucionado = True
            queryset.dataSolucao = datetime.now()
        else:
            queryset.solucionado = False
        queryset.save()
        return "ok"


class OcorrenciaFiltersViewSet(viewsets.ModelViewSet):
    serializer_class = OcorrenciaFiltersSerializer

    def get_queryset(self):
        queryset = Ocorrencia.objects.filter(
            dataehora__gte=datetime.strptime(self.request.query_params.get('datefrom', None), '%Y-%m-%d %H:%M'),
            dataehora__lte=datetime.strptime(self.request.query_params.get('dateto', None), '%Y-%m-%d %H:%M'))
        for ocorrencia in queryset:
            ocorrencia.datafile = settings.MEDIA_URL + Imagem.objects.get(id=ocorrencia.fileId).datafile.__str__()
            if ocorrencia.categoria == 1:
                ocorrencia.pessoa = Pessoa.objects.get(ocorrencia_id=ocorrencia.id)
            else:
                if ocorrencia.categoria == 2:
                    ocorrencia.animal = Animal.objects.get(ocorrencia_id=ocorrencia.id)
                else:
                    ocorrencia.objeto = Objeto.objects.get(ocorrencia_id=ocorrencia.id)
            print ocorrencia.datafile
        print queryset
        return queryset

