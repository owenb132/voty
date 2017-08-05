/**
 * Main application routes
 */

'use strict';

// Controllers
var userController = require('./controllers/user');
var pollController = require('./controllers/poll');
var voteController = require('./controllers/vote');

module.exports = app => {

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

    // Poll
    app.get('/api/polls', pollController.mostRecentN);
    app.get('/api/polls/:id', pollController.show);
    app.get('/api/polls/:id/user', pollController.getUser);
    app.post('/api/polls', pollController.create);
    app.patch('/api/polls/:id', pollController.patch);
    app.delete('/api/polls/:id', pollController.destroy);

    // Vote
    app.get('/api/votes', voteController.index);
    app.get('/api/votes/ip', voteController.findByIp);
    app.get('/api/votes/:id/user', voteController.getUser);
    app.get('/api/votes/:id/poll', voteController.getPoll);
    app.post('/api/votes', voteController.create);
    app.patch('/api/votes/:id', voteController.patch);
    app.delete('/api/votes/:id', voteController.destroy);

    // User
    app.get('/me/polls', userController.myPolls);
    app.get('/users/:id/polls', userController.getPolls);
    app.get('/me/votes', userController.myVotes);
    app.get('/users/:id/votes', userController.getVotes);
    app.get('/users/:id', userController.showUser);
    app.patch('/users/:id', userController.updateUser);

    app.get('*', function(req, res) {
        res.redirect('/#' + req.originalUrl);
    });
};