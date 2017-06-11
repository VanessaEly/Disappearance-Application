app.controller('ListaOcorrenciasController', function($scope, $http, StorageService, $rootScope) {

    $scope.data = { ocorrencia:[], detalhes:[], imagem:[], date:[]}
    $scope.filtros = {};
    $scope.filtrosAtuais = '';

    $scope.listaOcorrenciasInit = function() {
        $scope.host = StorageService.get("host");
        $http.get(StorageService.get("host") + 'api/ocorrencia/'
        ).success(function(response){
            $scope.data = response.results;
            for (var i = 0; i < $scope.data.length; i++) {
                $scope.data[i].categoria == 1? $scope.data[i].categoria = "Pessoa": $scope.data[i].categoria == 2?
                        $scope.data[i].categoria = "Animal": $scope.data[i].categoria = "Objeto";
                $scope.data[i].dataehoraToShow = new Date($scope.data[i].dataehora).toLocaleString('pt-BR');
                $scope.data[i].toFilter = new Date($scope.data[i].dataehora).getTime();
            }
            console.log($scope.data)
        }).error(function(response){
            console.log("get error", response);
        });
    }

    $scope.detalhesOcorrencia = function(data) {
        event.preventDefault();
        $scope.selected = data
        $rootScope.toggleId('detalhesModal');
    }

    $scope.getUrl = function() {
        $rootScope.toggleId('detalhesModal');
        var url = 'ocorrencia/'+ $scope.selected.id;
        $rootScope.goTo(url);
    }

    $scope.reverseOrder = function () {
		if ($scope.reverse == false){
			$scope.reverse = true;
		}
		else {
			$scope.reverse = false;
		}
	}
    $scope.boolToStr = function(arg) {return arg ? 'Sim' : 'Não'};

    $scope.limparFiltros = function () {
        $scope.filtros = {};
    }
});

