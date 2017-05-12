angular.module('App.controllers.Main', [])

.controller('MainController', ["$rootScope", "$scope", "$location", 
	function($rootScope, $scope, $location){
		$rootScope.isShopPage = false;
		$rootScope.$on('$routeChangeSuccess', function(scope, current, pre) {
	      	var baseRoute = $location.path().split("/")[1];
	      	$rootScope.isShopPage = (baseRoute=='shop')?true:false;
	      	$rootScope.noPadding = (baseRoute=='shop' || 
	      		baseRoute=='product')?false:true;
	      	console.log($location.path());
	    });
	    $rootScope.initiateSearch = function(){
	    	var query = angular.element(document.getElementById("search")).val();
	    	$rootScope.$broadcast("SearchProducts",{query:query});
	    }
	}
]);