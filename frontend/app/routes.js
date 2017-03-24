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
        .when('/novo-informe', {
            templateUrl: 'app/components/novoInforme/novoInformeView.html',
            replace: true,
            reloadOnSearch: false
        })

        // DEFAULT
        .otherwise({
            redirectTo: '/home'
        });

    // //Removing fragment identifier from AngularJS urls (# symbol)
    //  $locationProvider.html5Mode({
    //      enabled: true,
    //      requireBase: false
    //  });
});