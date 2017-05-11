app.controller('NovaOcorrenciaController', function($scope, $http, $rootScope) {

    $scope.ocorrencia = {}, $scope.pessoa = {}, $scope.animal = {}, $scope.objeto = {}, $scope.pa = {};
    var imageLoader = document.getElementById('filePhoto');
    imageLoader.addEventListener('change', handleImage, false);

    $(document).ready(function () {
        $('#datetimepicker').datetimepicker({
            defaultDate: Date.now(),
             format: 'YYYY-MM-DD MM:ss'
        });
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
        $('#datetimepicker1').datetimepicker();
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

        console.log("item", $scope.item);
        $http.post('http://localhost:8000/api/novoitem/', $scope.item, {
            headers: {"Authorization": "Token 5f7a57e87ebb87798a1cc28b808b9a694970cc99"}}).then(
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
            }
        );

    }
});

