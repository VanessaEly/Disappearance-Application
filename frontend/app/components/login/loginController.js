app.controller('LoginController', function($scope, $rootScope, $window, $http,
                                           ToastsService, $cookies, StorageService, $location, LoginService) {

    $scope.login = function () {
        console.log($scope.usuario)
        LoginService.authenticate($scope.usuario);
    }
});