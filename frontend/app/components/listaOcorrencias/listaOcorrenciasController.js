app.controller('ListaOcorrenciasController', function($scope, $http, $routeParams) {

    $scope.listaOcorrenciasInit = function() {
        console.log("lista ocorrencia init");
        $scope.currentPage = "";

        $http.get('http://localhost:8000/api/ocorrencia/'
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

//     $(function () {
//     /* BOOTSNIPP FULLSCREEN FIX */
//     if (window.location == window.parent.location) {
//         $('#back-to-bootsnipp').removeClass('hide');
//         $('.alert').addClass('hide');
//     }
//
//     $('#fullscreen').on('click', function(event) {
//         event.preventDefault();
//         window.parent.location = "http://bootsnipp.com/iframe/Q60Oj";
//     });
//
//     $('tbody > tr').on('click', function(event) {
//         event.preventDefault();
//         $('#myModal').modal('show');
//     })
//
    $('.btn-mais-info').on('click', function(event) {
        $( '.open_info' ).toggleClass( "hide" );
    })
//
//
// });
});

