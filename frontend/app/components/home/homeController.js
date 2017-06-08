app.controller('HomeController', function($scope, $http, StorageService, $rootScope) {
    $scope.filtros = {};
    $scope.homeInit = function() {
        $scope.host = StorageService.get("host");
    }

    $(document).ready(function () {
        $('#datefrom').datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            maxDate : 'now'
        });
        $('#dateto').datetimepicker({
            defaultDate: Date.now(),
            format: 'YYYY-MM-DD HH:mm',
            maxDate : 'now'
        });
    });

    $('#datetimepicker').datetimepicker().on('dp.change', function (ev) {
        $scope.filtros.datefrom = $('#datefrom').find("input").val();
        $scope.filtros.dateto = $('#dateto').find("input").val();
    });

    $scope.filtrarData = function() {
        $scope.filtros.datefrom= $('#datefrom').data('date');
        $scope.filtros.dateto= $('#dateto').data('date');

        if ( $scope.filtros.dateto != "" && $scope.filtros.datefrom != "" && $scope.filtros.datefrom != undefined) {
            $scope.tipo = $scope.categoria = $scope.solucionado = undefined;
            $http.get($scope.host + 'api/filtrar/?datefrom=' + $scope.filtros.datefrom + '&dateto=' + $scope.filtros.dateto).success(function (response) {
                $scope.directiveFn(response.results);
            }).error(function (response) {
                console.log(response)
            });
        } else {
            $rootScope.$broadcast("toast", {
                priority: "high",
                text: "Por favor, selecione duas datas"
            });
        }
    }

    $scope.filtrar = function() {
        var filter = '?';
        if ($scope.tipo)
            filter += 'tipo='+ $scope.tipo + '&'
        if ($scope.categoria)
            filter += 'categoria='+ $scope.categoria + '&'
        if ($scope.solucionado)
            filter += 'solucionado='+ $scope.solucionado + '&'
        $http.get($scope.host + 'api/ocorrencia/' + filter).success(function(response){
            $scope.directiveFn(response.results);
        }).error(function(response){
            console.log(response)
        });
    }

    $scope.setDirectiveFn = function(directiveFn){
    	$scope.directiveFn = directiveFn;
    }

});

