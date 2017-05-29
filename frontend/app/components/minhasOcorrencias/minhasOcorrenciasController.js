app.controller('MinhasOcorrenciasController', function($scope, $http, StorageService, $cookies, $rootScope) {

    $scope.data = { item:[], ocorrencia:[], detalhes:[], imagem:[], date:[]}

    $scope.minhasOcorrenciasInit = function() {
        $scope.host = StorageService.get("host");
        $scope.currentPage = "";
        $http.get(StorageService.get("host") + 'api/item/'
            , {headers: {"Authorization": "Token " + $cookies.get('token')}}
        ).success(function(response){
            $scope.data = response.results;
            for (var i = 0; i < $scope.data.length; i++)
               $scope.data[i].ocorrencia.dataehoraToShow =
                   new Date($scope.data[i].ocorrencia.dataehora).toLocaleString('pt-BR')
            console.log($scope.data)

        }).error(function(response){
            if (response.detail = "Token inváido") {
                $rootScope.$broadcast("toast", {
                    priority: "high",
                    text: "Você precisa estar logado para acessar esta página!"
                });
                $rootScope.goTo('/');
            }
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
        var url = 'ocorrencia/'+ $scope.data[$scope.index].id;
        $rootScope.goTo(url);
    }

    $scope.editarOcorrencia =  function (item) {
        $rootScope.goTo('/edit/' + item.id +'/'+ item.ocorrencia.latitude + '/'+ item.ocorrencia.longitude);
        // $http.get(StorageService.get("host") + 'api/isowner/?id=', item, {
        //     headers: {"Authorization": "Token " + $cookies.get('token')}}
        // ).success(function(response){
        //     $scope.data = response.results;
        //     for (var i = 0; i < $scope.data.length; i++)
        //        $scope.data[i].ocorrencia.dataehoraToShow =
        //            new Date($scope.data[i].ocorrencia.dataehora).toLocaleString('pt-BR')
        //     console.log($scope.data)
        //
        // }).error(function(response){
        //     console.log("get error", response);
        // });
    }

});

