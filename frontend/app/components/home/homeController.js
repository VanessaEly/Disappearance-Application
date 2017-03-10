app.controller('HomeController', function($scope, $rootScope) {

    $scope.homeInit = function() {
        console.log("home init");
        $scope.currentPage = $rootScope.currentPage;
    }
});

