app.config(function($routeProvider, $httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $routeProvider

        .when('/', {
            templateUrl: 'app/components/home/homeView.html',
            replace: true,
            reloadOnSearch: false
        })
        .when('/login', {
            templateUrl: 'app/components/login/loginView.html',
            replace: true,
            reloadOnSearch: false
        })
        .when('/cadastro-usuario', {
            templateUrl: 'app/components/cadastro-usuario/cadastroUsuarioView.html',
            replace: true,
            reloadOnSearch: false
        })
        .when('/nova-ocorrencia', {
            templateUrl: 'app/components/novaOcorrencia/novaOcorrenciaView.html',
            replace: true,
            reloadOnSearch: false
        }).when('/ocorrencia/:id', {
			templateUrl: 'app/components/ocorrencia/ocorrenciaView.html',
			replace: true,
			reloadOnSearch: false
		}).when('/listaOcorrencias/', {
			templateUrl: 'app/components/listaOcorrencias/listaOcorrenciasView.html',
			replace: true,
			reloadOnSearch: false
		})

        // DEFAULT
        .otherwise({
            redirectTo: '/'
        });

    // //Removing fragment identifier from AngularJS urls (# symbol)
    //  $locationProvider.html5Mode({
    //      enabled: true,
    //      requireBase: false
    //  });
});