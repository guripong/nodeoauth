const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./routes/oauth2');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

///////////////////////////////////
var session = require('express-session');

app.use(session({
 secret: '@#@$MYSIGN#@$#$', //쿠키변조방지값
 resave: false,  //세션을 언제나 저장할지 정하는값
 saveUninitialized: true   //세션저장되기전 uninitialized 상태로저장
}));
//////////////////////////////////////

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


///////////////////////////////////////////


/////////////////////////////////////////



app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error:'error'});
});

const port = 3002;
const myip = "0.0.0.0";
//const myip ="127.0.0.1";
app.listen(port, myip, function () {
  console.log('Connected ' + myip + ' \'s ' + port + ' port!!!');
});
module.exports = app;
