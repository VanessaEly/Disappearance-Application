app.config(function($routeProvider, $locationProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'app/components/home/homeView.html',
            replace: true,
            reloadOnSearch: false
        })
        .when('/cadastro-usuario', {
            templateUrl: 'app/components/cadastroUsuario/cadastroUsuarioView.html',
            replace: true,
            reloadOnSearch: false
        })
        .when('/nova-ocorrencia', {
            templateUrl: 'app/components/novaOcorrencia/novaOcorrenciaView.html',
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