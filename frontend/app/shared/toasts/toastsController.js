app.controller('ToastsController', function($scope, $rootScope, ToastsService) {

	$scope.toasts = {};

	$rootScope.$on("toast", function(event, args) {
		ToastsService.makeToast(args.priority ? args.priority : "low",
														args.text ? args.text : "",
														args.duration ? args.duration : 2000);
	});

	$scope.$watch(function() {
		return ToastsService.toasts;
	}, function() {
		$scope.toasts = ToastsService.toasts;
	});

});