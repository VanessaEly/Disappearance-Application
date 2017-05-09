app.controller('OcorrenciaController', function($scope, $http, $routeParams, $timeout) {
    $scope.ocorrenciaInit = function() {
        console.log("ocorrencia init");
        $scope.currentPage = "";

        $http.get('http://localhost:8000/api/ocorrencia/?id=' + $routeParams.id
        ).success(function(response){
            $scope.ocorrencia = response.results[0];
            console.log($scope.ocorrencia);

        }).error(function(response){
            console.log("get error", response);
        });
    }
});

