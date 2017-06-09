app.controller('ContatoController', function($scope, $http, StorageService, $rootScope) {

    $scope.contatoInit = function() {
        $scope.host = StorageService.get("host");
    }

    $scope.enviar = function () {
        $http.get($scope.host + 'api/contato/?assunto=' + $scope.contato.assunto +
            '&email=' + $scope.contato.email + '&mensagem=' + $scope.contato.mensagem).success(function(response){
            $rootScope.$broadcast("toast", {
                priority: "ok",
                text: "Obrigado! Seu e-mail enviado com sucesso :)"
            });
            $rootScope.goTo("/");
        }).error(function(response){
            console.log(response);
            $rootScope.$broadcast("toast", {
                priority: "high",
                text: "OPS! Algo deu errado :("
            });
        });
    }
});


