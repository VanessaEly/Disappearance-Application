app.controller('HeaderController', function($scope, $rootScope) {

    $scope.headerInit = function() {
        console.log("header init");
        $scope.currentPage = $rootScope.currentPage;
    }

    $scope.hoverIn = function(id){
        console.log(id);
        $(id).show();
    };

    $scope.hoverOut = function(id){
        $(id).hide();
    };

});