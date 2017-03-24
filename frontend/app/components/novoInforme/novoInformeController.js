app.controller('NovoInformeController', function($scope) {

    $scope.save = function() {
        console.log("saved");
    }

    $scope.$watch($scope.coordinates, function() {
   });

    $scope.novoInformeInit = function() {
        console.log("novo informe init");
    }
});

