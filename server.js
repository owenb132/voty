var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var sass = require('node-sass-middleware');

// Load environment variables from .env file
dotenv.load();

// Models
var User = require('./models/User');

// Controllers
var userController = require('./controllers/user');
var pollController = require('./controllers/poll');
var voteController = require('./controllers/vote');

var app = express();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(sass({ src: path.join(__dirname, 'public'), dest: path.join(__dirname, 'public') }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  req.isAuthenticated = function() {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    User.findById(payload.sub, function(err, user) {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

// Account
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);
app.post('/forgot', userController.forgotPost);
app.post('/reset/:token', userController.resetPost);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);

// Facebook
app.post('/auth/facebook', userController.authFacebook);
app.get('/auth/facebook/callback', userController.authFacebookCallback);

// Google
app.post('/auth/google', userController.authGoogle);
app.get('/auth/google/callback', userController.authGoogleCallback);

// Twitter
app.post('/auth/twitter', userController.authTwitter);
app.get('/auth/twitter/callback', userController.authTwitterCallback);

// Github
app.post('/auth/github', userController.authGithub);
app.get('/auth/github/callback', userController.authGithubCallback);

// Api routes
app.get('/api/polls', pollController.index);
app.get('/api/polls/:id', pollController.show);
app.get('/api/polls/:id/user', pollController.getUser);
app.post('/api/polls', pollController.create);
app.patch('/api/polls/:id', pollController.patch);
app.delete('/api/polls/:id', pollController.destroy);

app.get('/api/votes', voteController.index);
app.get('/api/votes/:id', voteController.show);
app.get('/api/votes/:id/user', voteController.getUser);
app.get('/api/votes/:id/poll', voteController.getPoll);
app.post('/api/votes', voteController.create);
app.patch('/api/votes/:id', voteController.patch);
app.delete('/api/votes/:id', voteController.destroy);

app.get('/me/polls', userController.myPolls);
app.get('/users/:id/polls', userController.getPolls);
app.get('/me/votes', userController.myVotes);
app.get('/users/:id/votes', userController.getVotes);

app.get('/users/:id', userController.showUser);
app.patch('/users/:id', userController.updateUser);

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

if (app.get('env') === 'development') {
  require('./seed');
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
