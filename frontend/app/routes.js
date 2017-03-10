app.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider

        .when('/home', {
            templateUrl: 'app/components/home/homeView.html',
            replace: true,
            reloadOnSearch: false
        })

        // DEFAULT
        .otherwise({
            redirectTo: '/home'
        });
});