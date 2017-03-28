var express = require('express');
var router = express.Router();

/* Admin Login */
router.get('/login', function(req, res, next) {
  res.render('backoffice/login', { title: 'Login' });
});

/* Dashboard */
router.get('/', function(req, res, next) {
  res.render('backoffice/index', { title: 'Back Office' });
});

module.exports = router;
