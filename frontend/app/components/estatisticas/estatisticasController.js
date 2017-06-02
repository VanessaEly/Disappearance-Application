app.controller('EstatisticasController', function($scope, $http, StorageService) {

    $scope.estatisticasInit = function() {
      $http.get(StorageService.get("host") + 'api/filteritem/?solucionado=True&categoria=3').success(function(response){
            console.log(response.results);
        }).error(function(response){
            console.log(response);
        });
        $scope.initCharts();
    }

    $scope.initCharts = function() {
      Chart.defaults.global.colors = ['#222930','#4EB1BA', '#0032a2']
        $scope.host = StorageService.get("host");
        $scope.series = ['Series A', 'Series B'];
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90],
            [10, 10, 10, 19, 10, 10, 10]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        $scope.options = {
            maintainAspectRatio: true,
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left',

                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };
    }
});


