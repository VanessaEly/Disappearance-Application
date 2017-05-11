app.controller("MainController", function($q, $scope, $location, $rootScope) {


	$scope.mainInit = function() {}

	$scope.goTo = function(aRouteParams) {
		if (aRouteParams) {
            $location.path(aRouteParams);
        }
		else{
			console.log("Go to /");
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