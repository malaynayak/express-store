angular.module('App.services.Product', [])
.factory('ProductService', function ($http) {
  var productService = {};
 
  productService.getFeaturedProducts = function(){
    return $http.get("/api/products?featured=true");
  }

  productService.getAllProducts = function(){
    return $http.get("/api/products");
  }

  productService.getProductCategories = function(){
    return $http.get("/api/product/categories");
  }

  productService.getProductBrands = function(){
    return $http.get("/api/product/brands");
  }

  return productService;
});