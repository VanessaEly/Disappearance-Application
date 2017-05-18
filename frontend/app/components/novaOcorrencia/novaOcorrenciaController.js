app.controller('NovaOcorrenciaController', function($scope, $http, $rootScope, $cookies, StorageService ) {

    $scope.ocorrencia = {}, $scope.pessoa = {}, $scope.animal = {}, $scope.objeto = {}, $scope.pa = {}, $scope.item = {};
    var imageLoader = document.getElementById('filePhoto');
    imageLoader.addEventListener('change', handleImage, false);

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
        console.log("nova ocorrencia init");
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
        $scope.item.ocorrencia = $scope.ocorrencia;

        if ($scope.item.categoria == "1") {
            $scope.pessoa.nome = $scope.pa.nome;
            $scope.pessoa.idade = $scope.pa.idade;
            $scope.pessoa.sexo = $scope.pa.sexo;
        }
        if ($scope.item.categoria == "2"){
            $scope.animal.nome = $scope.pa.nome;
            $scope.animal.idade  = $scope.pa.idade;
            $scope.animal.sexo = $scope.pa.sexo;
        }
        $scope.item.pessoa = $scope.pessoa;
        $scope.item.animal = $scope.animal;
        $scope.item.objeto = $scope.objeto;

        fileFormData = new FormData();
        fileFormData.append('datafile', document.getElementById('filePhoto').files[0]);

        $http.post(StorageService.get("host") + 'api/imagem/', fileFormData, { transformRequest: angular.identity,
            headers: {"Authorization": "Token " + $cookies.get('token'), "Content-Type":undefined, }}).then(
            function successCallback(response) {
                console.log(response.data);
                $scope.item.fileId = response.data.id;
                $scope.salvarItem();
            }, function errorCallback(response) {
                console.log(response);
                if(response.status == 401 || response.status == -1) {
                    $rootScope.$broadcast("toast", {
                        priority: "high",
                        text: "Necessário efetuar login"
                    });
                    $scope.toggleId('login-modal');
                }
            });
    }

    $scope.salvarItem = function() {
        console.log("item", $scope.item);
        $http.post(StorageService.get("host") + 'api/item/', $scope.item, {
            headers: {"Authorization": "Token " + $cookies.get('token')}}).then(
            function successCallback(response) {
                console.log(response);
                $rootScope.$broadcast("toast", {
                    priority: "low",
                    text: "Ocorrencia cadastrada com sucesso!"
                });
                $scope.goTo("/");
            }, function errorCallback(response) {
                console.log(response);
                if(response.status == 400) {
                    $rootScope.$broadcast("toast", {
                        priority: "high",
                        text: "Não foi possível cadastrar o item"
                    });
                }
                if(response.status == 401) {
                    $rootScope.$broadcast("toast", {
                        priority: "high",
                        text: "Necessário efetuar login"
                    });
                    $scope.toggleId('login-modal');
                }

            });
    }
});