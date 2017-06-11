app.controller('CadastroUsuarioController', function($scope,$rootScope, $http, ToastsService, LoginService) {
    $scope.usuario = {};

    $scope.cadastroUsuarioInit = function() {
    }

    $scope.cadastrar = function() {

        console.log($scope.usuario);
        LoginService.cadastrar($scope.usuario).then(function (response){
        }, function (response) {
            console.log(response);
            if(response.status == 400) {
                $scope.errors = [];
                for(var prop in response.data){
                    if (response.data.hasOwnProperty(prop)) {
                        $scope.errors.push(response.data[prop][0].toString());

                    }
                }
                for (var i = 0; i < $scope.errors.length; i++) {
                    $rootScope.$broadcast("toast", {
                    priority: "high",
                    text: $scope.errors[i]
                });
                }
            }
            if(response.status == 500) {
                $rootScope.$broadcast("toast", {
                    priority: "high",
                    text: "Ops, este e-mail já cadastrado!"
                });
            }

        });
    }
});

