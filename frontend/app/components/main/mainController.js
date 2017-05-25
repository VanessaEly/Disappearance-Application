app.controller("MainController", function($q, $scope, $location, $rootScope, LoginService, StorageService) {


	$scope.mainInit = function() {
		StorageService.set("host", 'http://localhost:8000/');
	}

	$scope.$watch(function() {
		return LoginService.loginInfo.isLogged;
	}, function() {
		if (LoginService.loginInfo.isLogged == false) {
			LoginService.revokeLogin();
		}
	});

	$rootScope.goTo = function(aRouteParams) {
		if (aRouteParams) {
            $location.path(aRouteParams);
        }
		else{
			console.log("Go to /");
		}

	}

	$rootScope.toggleId = function(id){
        var e = document.getElementById(id);
        if(e.style.display == 'block')
           e.style.display = 'none';
        else
           e.style.display = 'block';
    };
});