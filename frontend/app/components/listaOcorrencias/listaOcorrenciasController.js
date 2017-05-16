app.controller('ListaOcorrenciasController', function($scope, $http, StorageService) {

    $scope.listaOcorrenciasInit = function() {
        console.log("lista ocorrencia init");
        $scope.currentPage = "";

        $http.get(StorageService.get("host") + 'api/ocorrencia/'
        ).success(function(response){
            $scope.ocorrencias = response.results;
            console.log($scope.ocorrencias);

        }).error(function(response){
            console.log("get error", response);
        });
    }

    $scope.detalhesOcorrencia = function(ocorrencia) {
        event.preventDefault();
        $scope.ocorrencia = ocorrencia;
        $('#detalhesModal').modal('show');
    }

    $('.btn-mais-info').on('click', function(event) {
        $( '.open_info' ).toggleClass( "hide" );
    })
//
//
// });
});

