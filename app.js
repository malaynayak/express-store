var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbConfig =  require('./db-config'); //database configuration
var sessionConfig = require('./session-config');//session configuration
console.log(sessionConfig);
//connect to the database
var connectionString = 'mongodb://';
if(dbConfig.username !== "" && dbConfig.password !== ""){
	connectionString += dbConfig.username+':'+dbConfig.password+'@';
}
connectionString+= dbConfig.host+':'+dbConfig.port+'/'+dbConfig.database
mongoose.connect(connectionString);


var index = require('./routes/index');
var backoffice = require('./routes/backoffice/index');
var api = require('./routes/api/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//session

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionConfig);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',express.static(path.join(__dirname, 'bower_components')));

app.use('/', index);
app.use('/backoffice', backoffice);
app.use('/api', api);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
