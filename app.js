var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//new require
const hbs = require('express-handlebars');

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
  helpers: {
    numbering: (value) => {
      return value + 1
    },
    nothing: () => {
      return "nothing"
    }
  }
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
// app.use((req, res, next) => {
//   res.header('Cache-Control', 'max-age=2592000000');
//   // res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
//   // res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
//   // res.setHeader("Expires", "0"); // Proxies.
//   next();
// });

app.use(fileUpload())
app.use(session({
  secret: "Key",
  cookie: { maxAge: (60000 * 2) },
  resave: true,
  saveUninitialized: true
}))//session settings
db.connect((err) => {
  if (err) console.log('Connection Error ' + err);
  else console.log('Database Connected succesffully');
})//db connect
app.use('/', indexRouter);
app.use('/users', usersRouter);
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
