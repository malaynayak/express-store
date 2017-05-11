angular.module('App.controllers.Product', ['ngSanitize'])

.controller('ProductController', ["$rootScope", "$scope", "$routeParams", "ProductService",
	function($rootScope, $scope, $routeParams, ProductService){
		var productId = $routeParams.key;
		$scope.product = "";
		$scope.quantity = 1;
		$scope.relatedProducts = [];
		ProductService.loadProduct(productId).then(function(response){
			$scope.product = response.data;
			var filters = {category:$scope.product.category,related:$scope.product.key};
			return ProductService.getAllProducts(4,1,{},filters);
		}).then(function(response){
			$scope.relatedProducts = response.data.products;
		});
	}
]);