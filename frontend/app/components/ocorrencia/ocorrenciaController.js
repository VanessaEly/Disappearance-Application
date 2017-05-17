app.controller('OcorrenciaController', function($scope, $http, $routeParams, StorageService) {
    $scope.ocorrenciaInit = function() {
        $http.get(StorageService.get("host") + 'api/item/' + $routeParams.id + '/').success(function(response){
            $scope.item = response;
            $http.get(StorageService.get("host") + 'api/imagem/?id=' + $scope.item.fileId).success(function(response){
                $scope.imagem = response.results[0];
            }).error(function(response){console.log(response);});
            $http.get(StorageService.get("host") + 'api/ocorrencia/?item_id=' + $scope.item.id).success(function(response){
                $scope.ocorrencia = response.results[0];
                var url = $scope.item.categoria == 1 ? 'api/pessoa/?item_id=' :
                    $scope.item.categoria == 2 ? 'api/animal/?item_id=' : 'api/objeto/?item_id=';

                $http.get(StorageService.get("host") + url + $scope.item.id).success(function(response){
                    $scope.detalhes = response.results[0];
                    console.log("Item= ", $scope.item, "Ocor= ", $scope.ocorrencia, "Det= ", $scope.detalhes,
                    "Img = ", $scope.imagem);
                }).error(function(response){console.log(response);});
            }).error(function(response){console.log(response);});
        }).error(function(response){console.log(response);});
    }
});

