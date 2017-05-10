angular.module('App', [
  'ngRoute',
  'App.controllers.Main',
  'App.controllers.Home',
  'App.controllers.Shop',
])
.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "partials/home.html", 
        controller : "HomeController",
        reloadOnSearch: false
    })
    .when("/shop", {
        templateUrl : "partials/shop.html",
        controller : "ShopController",
        reloadOnSearch: false
    })
    .otherwise("/", {
        redirectTo  : "/"
    });
}).filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});