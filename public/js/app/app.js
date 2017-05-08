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
});