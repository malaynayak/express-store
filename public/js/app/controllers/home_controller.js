angular.module('App.controllers.Home', [
	'App.services.Product'
])

.controller('HomeController', ["$rootScope", "$scope", "$location", "ProductService",
	function($rootScope, $scope, $location, ProductService){
		$scope.featuredProducts = [];
		ProductService.getFeaturedProducts().then(function(response){
			$scope.featuredProducts = response.data.products;
		});
}]);