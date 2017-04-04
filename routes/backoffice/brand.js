var express = require('express');
var Brand = require('../../models/brand');
var url = require('url');
var router = express.Router();
var tools = require('./tools');

/* Brands */
router.route('/brand').get(tools.authenticate, function(req, res) {
	var filter = {};

	var query = url.parse(req.url, true).query;
	var search = "";
	if(query.search !== undefined && query.search !== ""){
	    search  = query.search;
	    filter.$or = [{"key":new RegExp(search, "i")},
	    	{"title":new RegExp(search, "i")}];
	}

	Brand.count(filter,function(err, count){
	    var pageSize = 5;
	    var skip = 0;
	    var pagerLength = tools.getPagerLength(pageSize,count);
	    var pageNo = parseInt(query.page);
	    if(isNaN(pageNo)) 
	    	pageNo = 1;
	    if(pageNo !== undefined && pageNo !== "" && typeof pageNo == "number"){
	      skip = (query.page - 1) * pageSize;
	    } 
	    Brand.find(filter).limit(pageSize).skip(skip).
	    	exec(function(err, brands) {
				if (err) {
					return res.send(err);
				}
				res.render('backoffice/brand/index', { 
					title: 'Product Brands', 
					brands : brands,
					search:search, 
					pages:pagerLength, 
					pageNo:pageNo,
					search:search
				});
		});
	});
});

/* Brand Add*/
router.route('/brand/add').get(tools.authenticate, function(req, res) {
  res.render('backoffice/brand/add', { title: 'Add Brand'});
});

/* Brand Add*/
router.route('/brand/add').post(tools.authenticate, function(req, res) {
  	var brand = new Brand(req.body);
  	if(req.body.status === undefined){
    	brand.status = false;
    } else if(req.body.status === 'on'){
    	brand.status = true;
    }
	brand.save(function(err) {
		if (err) {
	      if(err.name == "ValidationError"){
	        return res.render('backoffice/brand/add',{
	          errors:err.errors,
	          brand:brand,
	          title: 'Add Brand'
	        });
	      } else {
	        return res.send(err);
	      }
	    }
	    return res.redirect('/backoffice/brand');
	});
});

/* Brand Update*/
router.route('/brand/update/:key').get(tools.authenticate, 
	function(req, res) {
	Brand.findOne({ key: req.params.key }, function(err, brand) {
		if (err) {
			return res.send(err);
		}
		return res.render('backoffice/brand/update',{
			title:"Update Brand",brand:brand
		});
	});
});

/* Brand Update*/
router.route('/brand/update/:key').post(tools.authenticate, 
	function(req, res) {
	Brand.findOne({ key: req.params.key }, function(err, brand) {
		for (prop in req.body) {
			brand[prop] = req.body[prop];
		}
		if(req.body.status === undefined){
			brand['status'] = false;
		} else if(req.body.status === 'on'){
			brand['status'] = true;
		}
		brand.save(function(err) {
			if (err) {
				if(err.name == "ValidationError"){
					return res.render('backoffice/brand/update',{
						errors:err.errors,
						brand:brand,
						title: 'Update Brand'
					});
				} else {
					return res.send(err);
				}
			}
			return res.redirect('/backoffice/brand');
		});
	});
});

/* Brand Delete*/
router.route('/brand/delete/:key').get(tools.authenticate, 
	function(req, res) {
	Brand.findOne({ key: req.params.key }, function(err, brand) {
		if (err) {
			return res.send(err);
		}
		Brand.remove({key: req.params.key}, function(err, brand) {
			if (err) {
				return res.send(err);
			}
			res.redirect('/backoffice/brand');
		});
	});
});
module.exports = router;
