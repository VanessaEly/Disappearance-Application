app.controller('OcorrenciaController', function($scope, $http, $routeParams, StorageService, $cookies, $rootScope) {
    $scope.ocorrenciaInit = function() {
        $scope.host = StorageService.get("host");
        $http.get($scope.host + 'api/item/?id=' + $routeParams.id).success(function(response){
            if (response.count != 0) {
                $scope.data = response.results[0]
                $scope.data.ocorrencia.dataehoraToShow = new Date($scope.data.ocorrencia.dataehora).toLocaleString('pt-BR')
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