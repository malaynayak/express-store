angular.module('App.controllers.Main', ['App.services.Auth']) 
.directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            comparingModel: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.comparingModel;
            };
        }
    };
})
.controller('MainController', ["$rootScope", "$scope", "$location","AuthService",
	function($rootScope, $scope, $location,AuthService){
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

	    $scope.registration = {
            name:'',
            username : '',
            email : '',
            password : '',
            retype_password : ''
        };

        $scope.login = {
            username : '',
            password : '',
        };

        $scope.submitRegistrationForm = function(e){
        	var promise = AuthService.registerUser($scope.registration);
            promise.then(function(data){
                if(data.status !== undefined && data.status !== 'success'){
                    console.log("User registration successful");
                }
            },function(response){
                console.log(response.data);
            });
        }

        $scope.submitLoginForm = function(){
            alert("Submitted");
        }
	}
]);