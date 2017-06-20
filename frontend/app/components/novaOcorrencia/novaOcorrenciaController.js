app.controller('NovaOcorrenciaController', function($scope, $http, $rootScope, $cookies, StorageService ) {

    $scope.ocorrencia = {}, $scope.pessoa = {}, $scope.animal = {}, $scope.objeto = {}, $scope.pa = {};
    var imageLoader = document.getElementById('filePhoto');
    imageLoader.addEventListener('change', handleImage, false);
    $("#telefone").mask("(99) 9999?9-9999");

    $(document).ready(function () {
        $('#datetimepicker').datetimepicker({
            defaultDate: Date.now(),
            format: 'YYYY-MM-DD HH:mm',
            maxDate : 'now'
        });

    });

    $('#datetimepicker').datetimepicker().on('dp.change', function (ev) {
        $scope.ocorrencia.dataehora = $('#datetimepicker').find("input").val();
    });

    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            $('#uploader img').attr('src',event.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        document.getElementById('uploader').style.backgroundImage = "none";
        document.getElementById('uploader-text').style.display = "none";
    }

    $scope.$watch($scope.coordinates, function() {});

    $scope.novaOcorrenciaInit = function() {
        $scope.lista = StorageService.get("lista");
    }

    $scope.clearData = function () {
        $scope.pa = {};
        $scope.pessoa = {};
        $scope.animal = {};
        $scope.objeto = {};
    }

    $scope.save = function() {
        $scope.ocorrencia.dataehora = $('#datetimepicker').data('date');
        $scope.ocorrencia.endereco = $scope.coordinates.formatted_address;

        if ($scope.ocorrencia.categoria == "1") {
            $scope.pessoa.nome = $scope.pa.nome;
            $scope.pessoa.idade = $scope.pa.idade;
            $scope.pessoa.sexo = $scope.pa.sexo;
        }
        else{
            $scope.animal.nome = $scope.pa.nome;
            $scope.animal.idade  = $scope.pa.idade;
            $scope.animal.sexo = $scope.pa.sexo;
        }
        $scope.ocorrencia.pessoa = $scope.pessoa;
        $scope.ocorrencia.animal = $scope.animal;
        $scope.ocorrencia.objeto = $scope.objeto;

        fileFormData = new FormData();
        if (document.getElementById('filePhoto').files.length > 0)
            fileFormData.append('datafile', document.getElementById('filePhoto').files[0]);
        else
            fileFormData = undefined
        $http.post(StorageService.get("host") + 'api/imagem/', fileFormData, { transformRequest: angular.identity,
            headers: {"Authorization": "Token " + $cookies.get('token'), "Content-Type":undefined, }}).then(
            function successCallback(response) {
                console.log(response.data);
                $scope.ocorrencia.fileId = response.data.id;
                $scope.salvarOcorrencia();
            }, function errorCallback(response) {
                console.log(response);
                if(response.status == 401 || response.status == -1) {
                    $rootScope.$broadcast("toast", {
                        priority: "high",
                        text: "Necessário efetuar login"
                    });
                    $rootScope.toggleId('login-modal');
                }
            });
    }

    $scope.salvarOcorrencia = function() {
        console.log("ocorrencia", $scope.ocorrencia);
        $scope.ocorrencia.pin = "assets/images/" + $scope.ocorrencia.tipo + $scope.ocorrencia.categoria + ".png"
        $http.post(StorageService.get("host") + 'api/ocorrencia/', $scope.ocorrencia, {
            headers: {"Authorization": "Token " + $cookies.get('token')}}).then(
            function successCallback(response) {
                console.log(response);
                $rootScope.$broadcast("toast", {
                    priority: "ok",
                    text: "Ocorrência cadastrada com sucesso!"
                });
                $rootScope.goTo("/");
            }, function errorCallback(response) {
                console.log(response);
                if(response.status == 400) {
                    $rootScope.$broadcast("toast", {
                        priority: "high",
                        text: "Não foi possível cadastrar a ocorrência"
                    });
                }
                if(response.status == 401) {
                    $rootScope.$broadcast("toast", {
                        priority: "high",
                        text: "É necessário efetuar login."
                    });
                    $rootScope.toggleId('login-modal');
                }

            });
    }
});