var createError = require('http-errors');
var express = require('express');
  http = express(),
  fs = require('fs'),
  path = require('path'),
  url = require('url');
  imageDir = 'C:/Users/Ionut/maguay/node/public/uploaded/';
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const config = require('./config');
//const { Worker } = require('worker_threads');

var indexRouter = require('./routes/index');
var DAFPickProjectRouter = require('./routes/DAFPickProject');
var DAFViewFormRouter = require('./routes/DAFViewForm');
var DTPageRouter = require('./routes/DTPage');
var DTTableRouter = require('./routes/DTTable');
var ManualInputRouter = require('./routes/ManualInput');
var ManualInputFormRouter = require('./routes/ManualInputForm');
var ApiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/DAFPickProject', DAFPickProjectRouter);
app.use('/DAFViewForm', DAFViewFormRouter);
app.use('/DTPage', DTPageRouter);
app.use('/DTTable', DTTableRouter);
app.use('/ManualInput', ManualInputRouter);
app.use('/ManualInputForm', ManualInputFormRouter);
app.use('/api', ApiRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//config.worker = new Worker('./worker.js');

module.exports = app;
