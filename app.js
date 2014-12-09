var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var mongoose = require('mongoose');

var logger = morgan('dev');
var routes = require('./routes');
var app = express();
var cwd = process.cwd();

// Connect to the DB.
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/blog');
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', console.log.bind(
  console, 'Successfully connected to the database.'));

// view engine setup
app.engine('swig', swig.renderFile);
app.set('views', path.join(cwd, 'views'));
app.set('view engine', 'swig');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(cwd, 'public')));

app.use('/', routes);

// error handling

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* jshint unused:false */
app.use(function (err, req, res, next) {
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message,

      // Expose error in dev only.
      error: app.get('env') === 'development' ? err : {}
    });
});


module.exports = app;
