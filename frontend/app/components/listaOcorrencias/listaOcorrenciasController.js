app.controller('ListaOcorrenciasController', function($scope, $http, StorageService, $window) {

    $scope.data = { item:[], ocorrencia:[], detalhes:[], imagem:[], date:[]}

    $scope.listaOcorrenciasInit = function() {
        $scope.host = StorageService.get("host");

        console.log("lista ocorrencia init");
        $scope.currentPage = "";
        $http.get(StorageService.get("host") + 'api/item/'
        ).success(function(response){
            var count = response.count/4;
            for (var i = 0; i < count; i ++) {
                $scope.data.item.push(response.results[i]);
                $scope.data.ocorrencia.push(response.results[i + count]);
                $scope.data.detalhes.push(response.results[i + count*2]);
                $scope.data.imagem.push(response.results[i + count*3]);
                $scope.data.date.push(new Date(response.results[i + count].dataehora).toLocaleString('pt-BR'));
            }
            console.log($scope.data);

        }).error(function(response){
            console.log("get error", response);
        });
    }

    $scope.detalhesOcorrencia = function(index) {
        event.preventDefault();
        $scope.index = index
        $('#detalhesModal').modal('show');

    }

    $scope.getUrl = function() {
        $('#detalhesModal').modal('hide');
        var url = 'ocorrencia/'+ $scope.data.item[$scope.index].id;
        $scope.goTo(url);
    }

});

