app.controller('HeaderController', function($scope, $rootScope, $window, $http, ToastsService) {
    $('dropdown').hover(function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
}, function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
});
    $scope.headerInit = function() {}
});