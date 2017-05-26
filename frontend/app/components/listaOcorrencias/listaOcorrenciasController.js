app.controller('ListaOcorrenciasController', function($scope, $http, StorageService, $rootScope) {

    $scope.data = { item:[], ocorrencia:[], detalhes:[], imagem:[], date:[]}

    $scope.listaOcorrenciasInit = function() {
        $scope.host = StorageService.get("host");
        $http.get(StorageService.get("host") + 'api/item/'
        ).success(function(response){
            $scope.data = response.results;
            for (var i = 0; i < $scope.data.length; i++)
               $scope.data[i].ocorrencia.dataehoraToShow =
                   new Date($scope.data[i].ocorrencia.dataehora).toLocaleString('pt-BR')
            console.log($scope.data)

        }).error(function(response){
            console.log("get error", response);
        });
    }

    $scope.detalhesOcorrencia = function(index) {
        event.preventDefault();
        $scope.index = index
        console.log($scope.data[index])
        $('#detalhesModal').modal('show');

    }

    $scope.getUrl = function() {
        $('#detalhesModal').modal('hide');
        var url = 'ocorrencia/'+ $scope.data[$scope.index].id;
        $rootScope.goTo(url);
    }
});

