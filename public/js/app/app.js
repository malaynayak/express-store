angular.module('App', [
  'ngRoute',
  'App.controllers.Main',
  'App.controllers.Home',
  'App.controllers.Shop',
  'App.controllers.Product',
  'App.directives.Custom'
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
    .when("/product/:key", {
        templateUrl : "partials/product.html",
        controller : "ProductController",
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