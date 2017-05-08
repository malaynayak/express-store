angular.module('App.controllers.Shop', [])

.controller('ShopController', ["$rootScope", "$scope", "$location", "ProductService",
	function($rootScope, $scope, $location, ProductService){
		$scope.products = [];
		$scope.categories = [];
		$scope.brands = [];
		ProductService.getAllProducts().then(function(response){
			$scope.products = response.data;
		});
		ProductService.getProductCategories().then(function(response){
			$scope.categories = response.data;
		});
		ProductService.getProductBrands().then(function(response){
			$scope.brands = response.data;
		});

		$scope.toggleDisplayMode = function($event){
		    $event.preventDefault();
			$event.stopPropagation();
			var currentTarget = angular.element(event.currentTarget);
			jQuery(".mode-toggle").removeClass('active');
			currentTarget.addClass('active');
			if(currentTarget.hasClass('list-mode')){
				angular.element(document.querySelector(".shop-loop")).addClass('list');
			}else{
				angular.element(document.querySelector(".shop-loop")).removeClass('list');
			}
		}
}]);