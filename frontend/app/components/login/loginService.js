app.service("LoginService", function($window, $location, $http, $q, $cookies) {

	this.loginInfo = {
		isLogged: true
	}

	this.revokeLogin = function() {
		this.loginInfo.isLogged = false;
		$cookies.remove('token');
		$cookies.remove('user');

		//$location.path('/login');
	}

	this.authenticate =  function(usuario) {
		var deferred = $q.defer();
		$http({
			method:'POST',
			url: 'http://localhost:8000/api-token-auth/',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
				return str.join("&");
			},
			data: {
				username: usuario.username,
				password: usuario.password
			}
		})
		.then(function(response) {
			deferred.resolve(response);
		}, function(error) {
			console.log(error)
			deferred.reject(error);
		});

		console.log(deferred.promise);

		return deferred.promise;
	}
});