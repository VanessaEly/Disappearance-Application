app.controller('OcorrenciaController', function($scope, $http, $routeParams, StorageService, $cookies, $rootScope, $location) {
    $scope.ocorrenciaInit = function() {
        $scope.host = StorageService.get("host");
        $http.get($scope.host + 'api/item/?id=' + $routeParams.id).success(function(response){
            if (response.count != 0) {
                $scope.data = response.results[0]
                $scope.data.ocorrencia.dataehoraToShow = new Date($scope.data.ocorrencia.dataehora).toLocaleString('pt-BR')
                console.log($scope.data)
            } else {
                $rootScope.$broadcast("toast", {
                    priority: "high",
                    text: "Ocorrência não encontrada!"
                });
                $rootScope.goTo("/");
            }
        }).error(function(response){
            console.log(response);
        });
    }

    $scope.enviar = function () {
        var url =$location.absUrl().replace('#', '%23');
        $http.get($scope.host + 'api/contato/?assunto=' + $scope.contato.assunto +
            '&email=' + $scope.contato.email + '&mensagem=' + $scope.contato.mensagem + '&owner=' + $scope.data.owner +
            '&url=' + url).success(function(response){
            $rootScope.$broadcast("toast", {
                priority: "ok",
                text: "Obrigado! Seu email enviado com sucesso :)"
            });
            $rootScope.toggleId('contatoCriador');
        }).error(function(response){
            console.log(response);
            $rootScope.$broadcast("toast", {
                priority: "high",
                text: "OPS! Algo deu errado :("
            });
        });
    }
});