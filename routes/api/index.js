var express = require('express');
var router = express.Router();
var url = require('url');
var Product = require('../../models/product');
var Category = require('../../models/category');
var Brand = require('../../models/brand');

//get all the products
router.route('/products').get(function(req, res) {
  var filterParams =  [];
  var filters = {};
  var query = url.parse(req.url, true).query;
  if(query.search !== undefined && query.search !== ""){
    filterParams.push({"title":new RegExp(query.search, "i")});
  }
  if(query.category !== undefined && query.category !== ""){
    filterParams.push({"category":query.category});
  }
  if(query.brands !== undefined && query.brands.length){
    if(Array.isArray(query.brands) && query.brands.length > 1){
      var selectedBrands = [];
      for(var i=0;i<query.brands.length;i++){
        selectedBrands.push({"brand":query.brands[i]});
      }
      filterParams.push({$or:selectedBrands});
    } else {
      filterParams.push({"brand":query.brands});
    }
  }
  if(query.featured !== undefined && query.featured !== ""){
    filterParams.push({"featured":query.featured});
  }
  if(query.related !== undefined && query.related !== ""){
    filterParams.push({"key":{$ne:query.related}});
  }
  if(filterParams.length){
    filterParams.push({status:true});
    filters.$and = filterParams;
  } else {
    filters = {status:true};
  }
	Product.count(filters,function(err, count){
      var aggregateParams = [
        { $match: filters },
        {
          $lookup: {
           from: "categories",
           localField: "category",
           foreignField: "key",
           as: "category"
          }
        },
        {
          $lookup: {
           from: "brands",
           localField: "brand",
           foreignField: "key",
           as: "brand"
          }
        }
      ];
      var limit = 9;
      if(query.limit !== undefined && query.limit !== "" 
        && parseInt(query.limit) == query.limit){
        limit = parseInt(query.limit);
      }
      if(query.page !== undefined && query.page !== "" 
        && parseInt(query.page) == query.page){
        page = parseInt(query.page);
        skip = (page - 1) * limit;
        aggregateParams.push({$skip:skip});
      }
      var results = Product.aggregate(aggregateParams).limit(limit);
      if(query.sort !== undefined && query.sort !== ""){
        var order = 1;
        if(query.order !== undefined){
          if(query.order == "asc"){
            order = 1;
          } else if(query.order == "desc"){
            order = -1;
          }
          sort = JSON.parse("{\""+query.sort+"\":"+order+"}");
          results = results.sort(sort);
        }
      }

      results.exec(function(err, products) {
        if (err) {
          return res.send(err);
        }
        res.json({
          total:count,
          products:products
        });
      });
  });
});

//Load a product
router.route('/product/load/:key').get(function(req, res) {
  Product.findOne({ key: req.params.key }, function(err, product) {
    if (err) {
      return res.json(err);
    }
    if(!product){
      return res.status(500).json({
        error:{
          status:500,
          message:"Invalid Selection"
        }
      }); 
    }
    res.json(product);
  });
});


//Load a product categories
router.route('/product/categories').get(function(req, res) {
  Category.count({status:true},function(err, count){
      var results = Category.find({status:true});
      results.exec(function(err, categories) {
        if (err) {
          return res.send(err);
        }
        res.json(categories);
      });
  });
});


//Load a product brands
router.route('/product/brands').get(function(req, res) {
  Brand.count({status:true},function(err, count){
      var results = Brand.find({status:true});
      results.exec(function(err, categories) {
        if (err) {
          return res.send(err);
        }
        res.json(categories);
      });
  });
});

//catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error('Invalid Path');
  err.status = 404;
  next(err);
});

// error handler
router.use(function(err, req, res, next) {
    if (req.app.get('env') !== 'development') {
        delete err.stack;
    }
    res.status(err.status || 500).json({
      error:{
        status:err.status,
        message:err.message
      }
    });
});
module.exports = router;
