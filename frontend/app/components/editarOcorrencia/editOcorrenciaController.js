app.controller('EditOcorrenciaController', function($scope, $http, $rootScope, $cookies, $routeParams, StorageService ) {
    $scope.ocorrencia = {}, $scope.coordinates = {}, $scope.pa = {};

    $scope.$watch($scope.coordinates, function() {});
    $scope.$watch($('#datepicker'), function() {});
    $("#telefone").mask("(99) 9999?9-9999");
    var imageLoader = document.getElementById('filePhoto');
    imageLoader.addEventListener('change', handleImage, false);

    $(document).ready(function () {
        $('#datepicker').datetimepicker({
            defaultDate: Date.now(),
            format: 'YYYY-MM-DD HH:mm',
            maxDate : 'now'
        });

    });

    $('#datepicker').datetimepicker().on('dp.change', function (ev) {
        $scope.data.dataehora = $('#datepicker').find("input").val();
    });
    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            $('#uploader img').attr('src',event.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        document.getElementById('uploader').style.backgroundImage = "none";
    }

    $scope.editOcorrenciaInit = function() {
        $scope.lista = StorageService.get("lista");
        $scope.host = StorageService.get("host");
        $http.get($scope.host + 'api/ocorrencia/?id=' + $routeParams.id,{
            headers: {"Authorization": "Token " + $cookies.get('token')}}
            ).success(function(response){
                $scope.data = response.results[0];
                if ($scope.data === undefined) {
                    $rootScope.$broadcast("toast", {
                        priority: "high",
                        text: "Ocorrência não encontrada :("
                    });
                    $rootScope.goTo('/');
                }
                $scope.data.recompensa = parseFloat($scope.data.recompensa);
                $scope.data.categoria= $scope.data.categoria.toString();

                var detail;
                if ($scope.data.categoria != "3") {
                    if ($scope.data.pessoa) {
                        detail = $scope.data.pessoa;
                        $scope.data.pessoa.altura = parseFloat($scope.data.pessoa.altura)
                    } else {
                        detail = $scope.data.animal;
                        $scope.data.animal.altura = parseFloat($scope.data.animal.altura)
                    }
                    $scope.pa ={
                        nome: detail.nome,
                        idade: detail.idade,
                        sexo: detail.sexo
                    }
                }

                $('#datepicker').data("DateTimePicker").date(new Date($scope.data.dataehora));
                console.log($scope.data);
        }).error(function(response){
            if (response.detail = "Token inváido") {
                $rootScope.$broadcast("toast", {
                    priority: "high",
                    text: "Você não pode editar esta ocorrência!"
                });
                $rootScope.goTo('/');
            }
        });
    }

    $scope.save = function() {
        $scope.data.dataehora = $('#datepicker').data('date');
        $scope.data.endereco = $scope.coordinates.formatted_address;
        $scope.data.latitude = $scope.ocorrencia.latitude;
        $scope.data.longitude = $scope.ocorrencia.longitude;

        if ($scope.data.categoria == "1") {
            $scope.data.animal = {}, $scope.data.objeto = {};
            $scope.data.pessoa.nome = $scope.pa.nome;
            $scope.data.pessoa.idade = $scope.pa.idade;
            $scope.data.pessoa.sexo = $scope.pa.sexo;
        }
        else if($scope.data.categoria == "2"){
            $scope.data.pessoa = {}, $scope.data.objeto = {};
            $scope.data.animal.nome = $scope.pa.nome;
            $scope.data.animal.idade  = $scope.pa.idade;
            $scope.data.animal.sexo = $scope.pa.sexo;
        } else {
            $scope.data.animal = {}, $scope.data.pessoa = {};
        }
        $scope.data.categoria = parseInt($scope.data.categoria);

        fileFormData = new FormData();
        if (document.getElementById('filePhoto').files.length > 0) {
            fileFormData.append('datafile', document.getElementById('filePhoto').files[0]);
        }
        else
            fileFormData = undefined

        $scope.data.oldfileId = $scope.data.fileId;
        console.log($scope.data);
        $http.post(StorageService.get("host") + 'api/imagem/', fileFormData, { transformRequest: angular.identity,
        headers: {"Authorization": "Token " + $cookies.get('token'), "Content-Type":undefined, }}).then(
        function successCallback(response) {
            console.log(response.data);
            $scope.data.fileId = response.data.id;
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
        console.log("ocorrencia", $scope.data);
        $scope.data.pin = "assets/images/" + $scope.data.tipo + $scope.data.categoria + ".png"
        $http.post(StorageService.get("host") + 'api/ocorrencia/', $scope.data, {
            headers: {"Authorization": "Token " + $cookies.get('token')}}).then(
            function successCallback(response) {
                console.log(response);
                $rootScope.$broadcast("toast", {
                    priority: "ok",
                    text: "Ocorrencia editada com sucesso!"
                });
                $rootScope.goTo('/ocorrencia/' + $routeParams.id);
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
                        text: "Necessário efetuar login"
                    });
                    $rootScope.toggleId('login-modal');
                }

            });
    }
});