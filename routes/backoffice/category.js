var express = require('express');
var Category = require('../../models/category');
var url = require('url');
var router = express.Router();
var tools = require('./tools');

/* Categories */
router.route('/category').get(tools.authenticate, function(req, res) {
	var filter = {};

	var query = url.parse(req.url, true).query;
	var search = "";
	if(query.search !== undefined && query.search !== ""){
	    search  = query.search;
	    filter.$or = [{"key":new RegExp(search, "i")},
	    	{"title":new RegExp(search, "i")}];
	}

	Category.count(filter,function(err, count){
	    var pageSize = 5;
	    var skip = 0;
	    var pagerLength = tools.getPagerLength(pageSize,count);
	    var pageNo = parseInt(query.page);
	    if(isNaN(pageNo)) 
	    	pageNo = 1;
	    if(pageNo !== undefined && pageNo !== "" && typeof pageNo == "number"){
	      skip = (query.page - 1) * pageSize;
	    }
	    Category.find(filter).limit(pageSize).skip(skip).exec(function(err, categories) {
		  if (err) {
		    return res.send(err);
		  }
		  res.render('backoffice/category/index', { 
		  	title: 'Product Categories', 
		  	categories : categories,
		  	search:search, 
	        pages:pagerLength, 
	        pageNo:pageNo,
	        search:search
		  });
		});
	});
});

/* Category Add*/
router.route('/category/add').get(tools.authenticate, function(req, res) {
  res.render('backoffice/category/add', { title: 'Add Category'});
});

/* Category Add*/
router.route('/category/add').post(tools.authenticate, function(req, res) {
  	var category = new Category(req.body);
  	if(req.body.status === undefined){
    	category.status = false;
    } else if(req.body.status === 'on'){
    	category.status = true;
    }
	category.save(function(err) {
		if (err) {
	      if(err.name == "ValidationError"){
	        return res.render('backoffice/category/add',{
	          errors:err.errors,
	          category:category,
	          title: 'Add Category'
	        });
	      } else {
	        return res.send(err);
	      }
	    }
	    return res.redirect('/backoffice/category');
	});
});

/* Category Update*/
router.route('/category/update/:key').get(tools.authenticate, function(req, res) {
  Category.findOne({ key: req.params.key }, function(err, category) {
    if (err) {
      return res.send(err);
    }
    return res.render('backoffice/category/update',{
    	title:"Update Category",category:category});
  });
});

/* Category Update*/
router.route('/category/update/:key').post(tools.authenticate, function(req, res) {
  Category.findOne({ key: req.params.key }, function(err, category) {
  	for (prop in req.body) {
        category[prop] = req.body[prop];
    }
    if(req.body.status === undefined){
    	category['status'] = false;
    } else if(req.body.status === 'on'){
    	category['status'] = true;
    }
    category.save(function(err) {
		if (err) {
			if(err.name == "ValidationError"){
				return res.render('backoffice/category/update',{
				  errors:err.errors,
				  category:category,
				  title: 'Update Category'
				});
			} else {
				return res.send(err);
			}
	    }
	    return res.redirect('/backoffice/category');
	});
  });
});

/* Category Delete*/
router.route('/category/delete/:key').get(tools.authenticate, function(req, res) {
  Category.findOne({ key: req.params.key }, function(err, category) {
		if (err) {
	      return res.send(err);
	    }
	    Category.remove({
	      key: req.params.key
	    }, function(err, category) {
	      if (err) {
	        return res.send(err);
	      }
	      res.redirect('/backoffice/category');
	    });
  });
});
module.exports = router;
