/**
 * Main application routes
 */

'use strict';

// Controllers
var accountController = require('./controllers/account');
var userController = require('./controllers/user');
var pollController = require('./controllers/poll');
var voteController = require('./controllers/vote');

module.exports = app => {

    // Account
    app.put('/account', accountController.ensureAuthenticated, accountController.accountPut);
    app.delete('/account', accountController.ensureAuthenticated, accountController.accountDelete);
    app.post('/signup', accountController.signupPost);
    app.post('/login', accountController.loginPost);
    app.post('/forgot', accountController.forgotPost);
    app.post('/reset/:token', accountController.resetPost);
    app.get('/unlink/:provider', accountController.ensureAuthenticated, accountController.unlink);

    // Facebook
    app.post('/auth/facebook', accountController.authFacebook);
    app.get('/auth/facebook/callback', accountController.authFacebookCallback);

    // Google
    app.post('/auth/google', accountController.authGoogle);
    app.get('/auth/google/callback', accountController.authGoogleCallback);

    // Twitter
    app.post('/auth/twitter', accountController.authTwitter);
    app.get('/auth/twitter/callback', accountController.authTwitterCallback);

    // Github
    app.post('/auth/github', accountController.authGithub);
    app.get('/auth/github/callback', accountController.authGithubCallback);


    // Api routes

    // Poll
    app.get('/api/polls', pollController.mostRecentN);
    app.get('/api/polls/:id', pollController.show);
    app.get('/api/polls/:id/owner', pollController.getOwner);
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