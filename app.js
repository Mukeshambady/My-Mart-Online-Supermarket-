var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//new require
const hbs = require('express-handlebars');
var handlebarHelpers= require('./helpers/handlebar-helpers')
var app = express();

//new
var fileUpload = require('express-fileupload')//file upload
var db = require('./config/connection')//calling db config file
var session = require('express-session')

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var dealerRouter = require('./routes/dealer');



// view engine setup
//custome helper function engine setting
const chbs = hbs.create({
  extname: '.hbs',
  defaultLayout: 'layout',
  LayoutDir: __dirname + '/views/layout',
  partialsDir: __dirname + '/views/partials/',
  //create custom helper
  helpers: handlebarHelpers
})
app.engine('hbs', chbs.engine)
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware
//new middilewares
// app.use(function(req, res, next) {
 
//   // if (!req.user) {
//   //     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//   //     res.header('Expires', '-1');
//   //     res.header('Pragma', 'no-cache');
//   // }
//   next();
// });

app.use(fileUpload())
app.use(session({
  secret: "Key",
  cookie: { maxAge: (60000 * 2) },
  resave: true,
  saveUninitialized: true
}))//session settings
//global session to all handlebars
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
db.connect((err) => {
  if (err) console.log('Connection Error ' + err);
  else console.log('Database Connected succesffully');
})//db connect

app.use('/', usersRouter);
app.use('/index', indexRouter);
app.use('/admin', adminRouter);
app.use('/dealer', dealerRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
