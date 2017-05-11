angular.module('App.services.Product', [])
.factory('ProductService', function ($http) {
  var productService = {};
  
  //get featured products
  productService.getFeaturedProducts = function(){
    return $http.get("/api/products?featured=true");
  }

  //get products accrding to various filters
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
    if(filters.brands !== undefined && filters.brands.length){
      for(var i=0;i<filters.brands.length;i++){
        query.push("brands="+filters.brands[i]);
      }
    }
    if(filters.search !== undefined && filters.search !== ""){
      query.push("search="+filters.search);
    }
    if(filters.related !== undefined && filters.related !== ""){
      query.push("related="+filters.related);
    }
    return $http.get("/api/products?"+query.join("&"));
  }

  //load a product
  productService.loadProduct = function(productId){
    return $http.get("/api/product/load/"+productId);
  }

  //load product categories
  productService.getProductCategories = function(){
    return $http.get("/api/product/categories");
  }

  //load product brands
  productService.getProductBrands = function(){
    return $http.get("/api/product/brands");
  }

  return productService;
});