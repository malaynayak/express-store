var express = require('express');
var router = express.Router();
var url = require('url');
var Product = require('../../models/product');

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
  if(query.brand !== undefined && query.brand !== ""){
    filterParams.push({"brand":query.brand});
  }
  if(query.featured !== undefined && query.featured !== ""){
    filterParams.push({"featured":query.featured});
  }
  if(filterParams.length){
    filterParams.push({status:true});
    filters.$and = filterParams;
  } else {
    filters = {status:true};
  }
	Product.count(filters,function(err, count){
      
      var results = Product.aggregate([
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
        },
      ]);
      
      if(query.limit !== undefined && query.limit !== "" 
        && parseInt(query.limit) == query.limit){
        limit = parseInt(query.limit);
        if(query.page !== undefined && query.page !== "" 
          && parseInt(query.page) == query.page){
          page = parseInt(query.page);
          skip = (page - 1) * limit;
          results = results.limit(limit).skip(skip);
        }
      }

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
        res.json(products);
    });
  });
});

//Load a product
router.route('/product/:key').get(function(req, res) {
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
