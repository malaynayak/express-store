angular.module('App.controllers.Main', [])

.controller('MainController', ["$rootScope", "$scope", "$location", 
	function($rootScope, $scope, $location){
		$rootScope.showSearchForm = false;
		$rootScope.$on('$routeChangeSuccess', function(scope, current, pre) {
	      	$rootScope.showSearchForm = ($location.path()=='/shop')?true:false;
	    });
	    $rootScope.initiateSearch = function(){
	    	var query = angular.element(document.getElementById("search")).val();
	    	$rootScope.$broadcast("SearchProducts",{query:query});
	    }
	}
]);