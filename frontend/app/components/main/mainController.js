app.controller("MainController", function($q, $scope, $location, $rootScope, LoginService) {


	$scope.mainInit = function() {}

	$scope.$watch(function() {
		return LoginService.loginInfo.isLogged;
	}, function() {
		if (LoginService.loginInfo.isLogged == false) {
			LoginService.revokeLogin();
		}
	});

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