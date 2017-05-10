angular.module('App.services.Product', [])
.factory('ProductService', function ($http) {
  var productService = {};
 
  productService.getFeaturedProducts = function(){
    return $http.get("/api/products?featured=true");
  }

  productService.getAllProducts = function(limit,page,sort,filters){
    var query = [
      "limit="+limit,
      "page="+page,
    ];
    if(sort.field !== undefined && sort.order !== undefined){
      query.push("sort="+sort.field);
      query.push("order="+sort.order);
    }
    if(filters.category !== undefined){
      query.push("category="+filters.category);
    }
    if(filters.brands !== undefined && filters.brands.length){
      for(var i=0;i<filters.brands.length;i++){
        query.push("brands="+filters.brands[i]);
      }
    }
    return $http.get("/api/products?"+query.join("&"));
  }

  productService.getProductCategories = function(){
    return $http.get("/api/product/categories");
  }

  productService.getProductBrands = function(){
    return $http.get("/api/product/brands");
  }

  return productService;
});