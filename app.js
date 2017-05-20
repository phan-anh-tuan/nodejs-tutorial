var express = require('express');
var mongoose = require('mongoose');
var mongooseDB = 'mongodb://127.0.0.1:27017/local_library';
mongoose.connect(mongooseDB);
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'MongoDB connection error:'));

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog');  //Import routes for "catalog" area of site

var app = express();
var store = new MongoDBStore(
{
  uri: mongooseDB,
  collection: 'mySessions'
});
store.on('error', function(error) {
  console.log(error.stack);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    store: store
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.format = function(d,f) {return require('moment')(d).format(f);}
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    if (req.url!=='/login' && req.url!=='/register' && !req.user) {             
        res.redirect('/login');
        return;
    }
    next(); 
})
app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);
app.use('/api/*', function(req,res,next){
    res.json(req.cookies);
    return;
});

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

require('express-debug')(app, {/* settings */});

// catch 404 and forward to error handler
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
