angular.module('App.controllers.Shop', [])

.controller('ShopController', ["$rootScope", "$scope", "$location", "ProductService",
	function($rootScope, $scope, $location, ProductService){
		$scope.limit = 9;
		$scope.page = 1;
		$scope.order = {};
		$scope.filters = {};
		$scope.filters.brands = [];
		$scope.filters.search = "";
		$scope.products = [];
		$scope.categories = [];
		$scope.brands = [];
		
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
			angular.element(document.getElementsByClassName("mode-toggle")).removeClass('active');
			currentTarget.addClass('active');
			if(currentTarget.hasClass('list-mode')){
				angular.element(document.querySelector(".shop-loop")).addClass('list');
			}else{
				angular.element(document.querySelector(".shop-loop")).removeClass('list');
			}
		}

		$scope.changePage = function(page){
			$scope.page = page;
			$scope.loadProducts();
		}

		$scope.sortProducts = function(sortOrder){
			var arr = sortOrder.split("-");
			$scope.order = {
				"field": arr[0],
				"order": arr[1]
			};
			$scope.loadProducts();
		}

		$scope.filterByCategory = function(category){
			if($scope.filters.category == category){
				$scope.filters.category = "";
			} else {
				$scope.filters.category = category;
			}
			$scope.loadProducts();
		}

		$scope.filterByBrands = function($event) {
		  var checkbox = $event.target;
		  if(checkbox.checked){
            if($scope.filters.brands.indexOf(checkbox.value) == -1){
            	$scope.filters.brands.push(checkbox.value);
            }
		  } else {
		  	if($scope.filters.brands.indexOf(checkbox.value) != -1){
            	var index = $scope.filters.brands.indexOf(checkbox.value);
            	$scope.filters.brands.splice(index,1);
            }
		  }
		  $scope.loadProducts();
		};

		$scope.loadProducts = function(){
		    ProductService.getAllProducts($scope.limit,$scope.page,
		    	$scope.order,$scope.filters).then(function(response){
				$scope.total = response.data.total;
				$scope.products = response.data.products;
				$scope.pagerLength = getPagerLength($scope.limit,$scope.total);
			});
		}

		$scope.$on("SearchProducts", function(evt,data){ 
			$scope.filters.search = data.query;
			$scope.loadProducts();
		});
		$scope.loadProducts();
}]);

getPagerLength = function(pageSize, count){
	var pagerLength = 0;
	if(count < pageSize){
    	var pagerLength = 1;
    } else{
    	var remainder = count % pageSize;
	    var quotient = count / pageSize;
	    var pagerLength = parseInt((remainder == 0) ? quotient : quotient+1);
    }
    return pagerLength;
}