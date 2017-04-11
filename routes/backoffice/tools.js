var Product = require('../../models/product');
module.exports = {
	//Authorization Middleware
	'authenticate': function(req, res, next) {
		if (req.session && req.session.user && req.session.user.role === "Admin")
			return next();
		else
			res.redirect('/backoffice/login');
	},
	getPagerLength:function(pageSize, count){
		var pagerLength = 0;
		if(count < pageSize){
	    	var pagerLength = 1;
	    } else{
	    	var remainder = count % pageSize;
		    var quotient = count / pageSize;
		    var pagerLength = parseInt((remainder == 0) ? quotient : quotient+1);
	    }
	    return pagerLength;
	},
	validateProduct: function(req, res, next){
		Product.findOne({ key: req.params.key }, function(err, product) {
			if (product.length == 0) {
				res.redirect('/backoffice/product');
			} else {
				return next();
			}
		});
	}
};