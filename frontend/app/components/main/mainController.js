app.controller("MainController", function($q, $scope, $location, $rootScope) {

	$scope.mainInit = function() {}

	$scope.goTo = function(aRoute, aRouteParams) {
		if (aRouteParams) {
			$location.path(aRoute).search(aRouteParams);
			console.log("Go to", aRoute, aRouteParams);
		} else if ($location.path() == '/cadastroUsuario'){
			$rootScope.$apply(function() {
	        	$location.path("/");
	        });
			console.log("Go to /");
		}
		else {
			$location.path(aRoute);
			console.log("Go to", aRoute);
		}
	}

	$scope.toggleId = function(id){
        var e = document.getElementById(id);
        if(e.style.display == 'block')
           e.style.display = 'none';
        else
           e.style.display = 'block';
    };
});