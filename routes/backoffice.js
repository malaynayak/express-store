var express = require('express');
var router = express.Router();
var User = require('../models/user');

//Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "Admin")
    return next();
  else
    res.redirect('/backoffice/login');
};

/* Admin Login */
router.route('/login').get(function(req, res, next) {
  	res.render('backoffice/login', { title: 'Login' });
});

/* Admin Login Form Submission*/
router.route('/login').post(function(req, res) {
	var error = "";
	var username = req.body.username;
	var password = req.body.password;

	var user = User.load({
		'criteria':{"username":username},
		'select' : "username role name email salt hashed_password"
	},function(err,user){
		if(error){
			return res.send(err);
		}
		if(user && user.authenticate(password)){
			req.session.user = user;
	    	res.redirect('/backoffice');
		} else {
			error = "Invalid username or password";
			res.render('backoffice/login', {
				title: 'Login' ,
				username:username,
		        password:password,
				error: error
			});
		}
	});
});

//Logout
router.route('/logout').get(auth, function (req, res) {
  req.session.destroy();
  res.redirect('/backoffice/login');
});

/* Dashboard */
router.route('/').get(auth, function(req, res) {
  res.render('backoffice/index', { title: 'Back Office'});
});

module.exports = router;
