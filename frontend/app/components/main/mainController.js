app.controller("MainController", function($q, $scope, $location, $rootScope) {

	$scope.mainInit = function() {
        console.log("main init");
	}
    $scope
        .goTo = function(aRoute, aRouteParams) {
		if (aRouteParams) {
			$location.path(aRoute).search(aRouteParams);
			console.log("Go to", aRoute, aRouteParams);
		} else {
			$location.path(aRoute);
			console.log("Go to", aRoute);
		}
	}
});