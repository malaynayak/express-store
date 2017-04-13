var express = require('express');
var Product = require('../../models/product');
var url = require('url');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var tools = require('./tools');
var Brand = require('../../models/brand');
var Category = require('../../models/category');
var multer = require('multer');

/* List Products */
router.route('/product').get(tools.authenticate, function(req, res) {
	var filter = {};

	var query = url.parse(req.url, true).query;
	var search = "";
	if(query.search !== undefined && query.search !== ""){
	    search  = query.search;
	    filter.$or = [{"key":new RegExp(search, "i")},
	    	{"title":new RegExp(search, "i")}];
	}

	Product.count(filter,function(err, count){
	    var pageSize = 10;
	    var skip = 0;
	    var pagerLength = tools.getPagerLength(pageSize,count);
	    var pageNo = parseInt(query.page);
	    if(isNaN(pageNo)) 
	    	pageNo = 1;
	    if(pageNo !== undefined && pageNo !== "" && typeof pageNo == "number"){
	      skip = (query.page - 1) * pageSize;
	    } 
	    Product.find(filter).limit(pageSize).skip(skip).
	    	exec(function(err, products) {
				if (err) {
					return res.send(err);
				}
				res.render('backoffice/product/index', { 
					title: 'Product Products', 
					products : products,
					search:search, 
					pages:pagerLength, 
					pageNo:pageNo,
					search:search
				});
		});
	});
});

/* Product Add */
router.route('/product/add').get(tools.authenticate, function(req, res) {
	renderProductForm(res,{title: 'Add Product'},'add');
});

/* Product Add - Form Handler */
router.route('/product/add').post(tools.authenticate, function(req, res) {
	var product = new Product(req.body);
	if(req.body.status === undefined){
    	product.status = false;
    } else if(req.body.status === 'on'){
    	product.status = true;
    }

    if(req.body.featured === undefined){
    	product.featured = false;
    } else if(req.body.featured === 'on'){
    	product.featured = true;
    }
    product.save(function(err) {
		if (err) {
			var params = {
	            product:product,
	            errors:err.errors
	      	}; 
	      	return renderProductForm(res,params,'add');
	    } else {
	    	return res.redirect('/backoffice/product/update/'+product.key);
	    }
	});
});

/* Product Update */
router.route('/product/update/:key').get(tools.authenticate, 
	function(req, res) {
	Product.findOne({ key: req.params.key }, function(err, product) {
		if (err) {
			return res.send(err);
		}
		renderProductForm(res,{title: 'Update Product',product:product},'update');
	});
});

/* Product Update - Form Handler */
router.route('/product/update/:key').post(tools.authenticate, 
	function(req, res) {
	Product.findOne({ key: req.params.key }, function(err, product) {
		for (prop in req.body) {
			product[prop] = req.body[prop];
		}
		if(req.body.status === undefined){
			product['status'] = false;
		} else if(req.body.status === 'on'){
			product['status'] = true;
		}
		if(req.body.featured === undefined){
	    	product.featured = false;
	    } else if(req.body.featured === 'on'){
	    	product.featured = true;
	    }
		product.save(function(err) {
			if (err) {
				if(err.name == "ValidationError"){
					renderProductForm(res,{
						errors:err.errors,
						title: 'Update Product',
						product:product},'update');
				} else {
					return res.send(err);
				}
			}
			return res.redirect('/backoffice/product');
		});
	});
});

/* Product Image Section */
router.route('/product/image/:key').get(tools.authenticate, 
	function(req, res) {
	Product.findOne({ key: req.params.key }, function(err, product) {
		if (err) {
			return res.send(err);
		}
		res.render("backoffice/product/image",{
			title:"Update Product Image",
			product:product
		});
	});
});

//Image upload
var upload = multer({ 
  dest: 'product_images/',
  fileFilter: function(req, file, cb) {
    var allowed = ["image/png", "image/jpeg"];
    if(allowed.indexOf(file.mimetype) != -1){
      cb(null, true);
    } else {
      cb('Only jpg,jpeg,png extensions allowed', false);
    }
  },
  limits:{
    fileSize:5242880 //5 Mb
  } 
});
uploader = upload.single('image');

/* Product Image Upload */
router.route('/product/image/:key').post(tools.authenticate, 
	tools.validateProduct, function(req, res) {
	Product.findOne({ key: req.params.key }, function(err, product) {
		uploader(req, res, function (err) {
			if (err) {
				return res.render('backoffice/product/image', {
					errors:{"image":{"message":err}},
					title:"Update Product Image",
					product:product
		        });
			}
			if(product.image !== undefined && product.image !== ""){
		        //delete the existing image
		        try {
		          fs.unlinkSync(path.join(product.image.destination, 
		            product.image.filename));
		        } catch (err) {
		          console.log("error while deleting the mage");
		        }
		    }
			product.image  = req.file;
			product.save(function(err){
				res.redirect('/backoffice/product/image/'+product.key);
			});
		});
	});
});

/* Load product image */
router.route('/product/image/load/:key').get(tools.validateProduct,
	function(req,res){
	Product.findOne({ key: req.params.key }, function(err, product) {
		if (err) {
			return res.send(err);
		}
		if(product.image !== undefined && product.image != ""){
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

/* Remove product image */
router.route('/product/image/remove/:key').get(tools.authenticate, 
	tools.validateProduct,function(req,res){
		Product.findOne({ key: req.params.key }, function(err, product) {
			if (err) {
				return res.send(err);
			}
			if(product.image !== undefined && product.image !== ""){
		        try {
		          fs.unlinkSync(path.join(product.image.destination, 
		            product.image.filename));
		        } catch (err) {
		          console.log("error while deleting the mage");
		        }
		        product.image = "";
		        product.save();
		    }
		    res.redirect('/backoffice/product/image/'+product.key);
		});
});

/* Product Delete */
router.route('/product/delete/:key').get(tools.authenticate, 
	tools.validateProduct, function(req, res) {
	Product.findOne({ key: req.params.key }, function(err, product) {
		var image = product.image;
		Product.remove({key: req.params.key}, function(err, product) {
			if (err) {
				return res.send(err);
			}
			if(image !== undefined && image !== ""){
		        try {
		          fs.unlinkSync(path.join(image.destination, 
		            image.filename));
		        } catch (err) {
		          console.log("error while deleting the mage");
		        }
		    }
			res.redirect('/backoffice/product');
		});
	});
});

function renderProductForm(response, params, view){
	var brands, categories = [];
	Brand.find({status:true}).exec().then(function(results){
		brands = results;
		brands.unshift({"key":"","title":"Select Brand"});
		return Category.find({status:"true"}).exec();
	}).then(function(results){
		categories = results;
		categories.unshift({"key":"","title":"Select Category"});
		var obj = {
			categories : categories,
			brands : brands
		};
		for (var key in params) {
	        if (!obj.hasOwnProperty(key)) 
	        	obj[key] = params[key];
	    }
		response.render('backoffice/product/'+view, obj);
	});
}
module.exports = router;
