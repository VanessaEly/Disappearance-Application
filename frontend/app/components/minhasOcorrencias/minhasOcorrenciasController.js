app.controller('MinhasOcorrenciasController', function($scope, $http, StorageService, $cookies, $rootScope) {

    $scope.data = { item:[], ocorrencia:[], detalhes:[], imagem:[], date:[]}

    $scope.minhasOcorrenciasInit = function() {
        $scope.host = StorageService.get("host");
        $scope.currentPage = "";
        $http.get(StorageService.get("host") + 'api/item/', {
            headers: {"Authorization": "Token " + $cookies.get('token')}}
        ).success(function(response){
            var count = response.count/4;
            for (var i = 0; i < count; i ++) {
                $scope.data.item.push(response.results[i]);
                $scope.data.ocorrencia.push(response.results[i + count]);
                $scope.data.detalhes.push(response.results[i + count*2]);
                $scope.data.imagem.push(response.results[i + count*3]);
                $scope.data.date.push(new Date(response.results[i + count].dataehora).toLocaleString('pt-BR'));
            }
            console.log($scope.data.length);

        }).error(function(response){
            console.log("get error", response);
        });
    }

    $scope.deletarOcorrencia = function(id) {
        $http.delete($scope.host + 'api/item/?id=' + id, {
            headers: {"Authorization": "Token " + $cookies.get('token')}}).success(function(response){
            $rootScope.$broadcast("toast", {
                priority: "ok",
                text: response
            });
            $rootScope.goTo("/");
        }).error(function(response){
            $rootScope.$broadcast("toast", {
                priority: "high",
                text: response
            });
            $rootScope.toggleId('login-modal');

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
        $rootScope.goTo(url);
    }

});

