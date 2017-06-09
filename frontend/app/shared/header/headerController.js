app.controller('HeaderController', function($scope, $cookies, LoginService, $rootScope) {
    $scope.token = $cookies.get('token');

    $rootScope.$on('updateHeader', function() {
         $scope.token = $cookies.get('token');
     });

    $('dropdown').hover(function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });
    $scope.headerInit = function() {}

    $scope.logout = function () {
        LoginService.revokeLogin();
    }
});