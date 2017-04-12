var express = require('express');
var router = express.Router();
var Product = require('../../models/product');

//get all the products
router.route('/products').get(function(req, res) {
	Product.find(function(err, movies) {
	  if (err) {
	    return res.send(err);
	  }
	  res.json(movies);
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
