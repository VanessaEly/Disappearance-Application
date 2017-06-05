app.service("LoginService", function($window, $location, $http, $q, $cookies, StorageService, $rootScope) {
	var loginService = this;
	this.loginInfo = {
		isLogged: true
	}

	this.revokeLogin = function() {
		this.loginInfo.isLogged = false;
		$cookies.remove('token');
		$cookies.remove('user');
		$location.path('/login');
		$window.location.reload();
	}

	this.cadastrar =  function(usuario) {
		var deferred = $q.defer();
		$http({
			method:'POST',
			url: StorageService.get("host") + 'api/users/',
			data: {
				email: usuario.email,
				password: usuario.password,
				first_name: usuario.first_name,
				last_name: usuario.last_name
			}
		})
		.then(function(response) {
			$rootScope.$broadcast("toast", {
				priority: "ok",
				text: "Cadastrado com sucesso!"
			});
			loginService.authenticate(usuario);
			 if ($location.path() == "/cadastro-usuario") {
                $rootScope.goTo("/");
            } else {
                $rootScope.toggleId('cadastro-modal');
            }
			deferred.resolve(response);
		}, function(error) {
			deferred.reject(error);
		});

		console.log(deferred.promise);

		return deferred.promise;
	}

	this.authenticate =  function(usuario) {
		var deferred = $q.defer();
		$http({
			method:'POST',
			url: StorageService.get("host") + 'api-token-auth/',
			data: {
				username: usuario.email,
				password: usuario.password
			}
		})
		.then(function(response) {
			$rootScope.$broadcast("toast", {
				priority: "ok",
				text: "Logado com sucesso!"
			});
            $cookies.put("token", response.data.token);
            if ($location.path() == "/login") {
            	$window.location.reload();
                $rootScope.goTo("/");
            } else {
                document.getElementById('login-modal').style.display='none';
            }
			deferred.resolve(response);
		}, function(error) {
			 if (error.status == 400) {
                $rootScope.$broadcast("toast", {
                    priority: "high",
                    text: "Login ou senha inválidos!"
                });
            }
			deferred.reject(error);
		});

		console.log(deferred.promise);

		return deferred.promise;
	}
});