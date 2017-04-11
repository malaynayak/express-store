//Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "Admin")
    return next();
  else
    res.redirect('/backoffice/login');
};