angular.module('Votapalooza', ['ngRoute', 'satellizer'])
  .config(function($routeProvider, $locationProvider, $authProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      })
      .when('/create', {
        templateUrl: 'partials/create.html',
        resolve: { loginRequired: loginRequired }
      })
      .when('/me/polls', {
        templateUrl: 'partials/myPolls.html',
        resolve: { loginRequired: loginRequired }
      })
      .when('/me/votes', {
        templateUrl: 'partials/myVotes.html',
        resolve: { loginRequired: loginRequired }
      })
      .when('/poll/:id', {
        templateUrl: 'partials/viewPoll.html'
      })
      .when('/poll/edit/:id', {
        templateUrl: 'partials/editPoll.html',
        resolve: { loginRequired: loginRequired }
      })
      .when('/user/:id', {
        templateUrl: 'partials/user.html'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/account', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/forgot', {
        templateUrl: 'partials/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/reset/:token', {
        templateUrl: 'partials/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.facebook({
      url: '/auth/facebook',
      clientId: '980220002068787',
      redirectUri: 'http://localhost:3000/auth/facebook/callback'
    });
    $authProvider.google({
      url: '/auth/google',
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
    });
    $authProvider.twitter({
      url: '/auth/twitter'
    });
    $authProvider.github({
      url: '/auth/github',
      clientId: 'c8d5bf482c0ece46fa1a'
    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  })
  .run(function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  });
