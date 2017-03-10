app.controller('FooterController', function($scope, $rootScope) {

    $scope.footerInit = function() {
        console.log("footer init");
        $scope.currentPage = $rootScope.currentPage;
    }
});