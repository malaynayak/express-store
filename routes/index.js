var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var path = require('path');
var fs = require('fs');
var im = require('imagemagick');

/* Home Page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Store' });
});

/* To render angular partial views */
router.get('/partials/:view', function(req, res, next) {
  var viewName = req.params.view.split(".")[0];
  return res.render('partials/'+viewName);
});

/* To render angular partial views */
router.get('/partials/:view', function(req, res, next) {
  var viewName = req.params.view.split(".")[0];
  return res.render('partials/'+viewName);
});

/* To load product thumb image */
router.get('/product/image/thumb/:key/', function(req, res, next) {
    var productKey = req.params.key;
    Product.findOne({ key: req.params.key }, function(err, product) {
		if (err) {
			return res.send(err);
		}
		if(product && product.image !== undefined && product.image != ""){
			res.set('Content-Type', product.image.mimetype);
			im.crop({
			    srcData: fs.readFileSync(path.join(product.image.destination, 
			 		product.image.filename),'binary'),
			    width:  400,
			    height: 400
			}, function(err, stdout, stderr) {
				if(err){
					res.send(err);
				}
				res.write(stdout,'binary');
    			res.end(null, 'binary');
			});
		}
	});
});

/* To load product image  */
router.get('/product/image/:key/', function(req, res, next) {
    var productKey = req.params.key;
    Product.findOne({ key: req.params.key }, function(err, product) {
		if (err) {
			return res.send(err);
		}
		if(product && product.image !== undefined && product.image != ""){
			res.set('Content-Type', product.image.mimetype);
			var readStream = fs.createReadStream(path.join(product.image.destination, 
				product.image.filename));
				readStream.on('error',function(err){
				return res.send(err);
			});
			res.setHeader('Content-Type', product.image.mimetype);
			readStream.pipe(res);
		}
	});
});

module.exports = router;
