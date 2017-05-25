app.controller('OcorrenciaController', function($scope, $http, $routeParams, StorageService, $cookies, $rootScope) {
    $scope.ocorrenciaInit = function() {
        $scope.host = StorageService.get("host");
        $http.get($scope.host + 'api/item/?id=' + $routeParams.id).success(function(response){
            console.log(response)
            if (response.count != 0) {
                 $scope.data = {
                    item: response.results[0],
                    ocorrencia: response.results[1],
                    detalhes: response.results[2],
                    imagem: response.results[3],
                    date: new Date(response.results[1].dataehora).toLocaleString('pt-BR')
                };
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
});