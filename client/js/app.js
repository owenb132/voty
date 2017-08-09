angular.module('Voty', ['ngRoute', 'satellizer', 'chart.js'])
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
      .when('/mypolls', {
        templateUrl: 'partials/myPolls.html',
        resolve: { loginRequired: loginRequired }
      })
      .when('/myvotes', {
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
      clientId: '123000398332587'
    });
    $authProvider.google({
      url: '/auth/google',
      clientId: '849320686441-77tkhpo99qs9132n8vl4o3e7cgtn2d3i.apps.googleusercontent.com',
      redirectUri: 'http://localhost:3000/auth/google/callback'
    });
    $authProvider.twitter({
      url: '/auth/twitter'
    });
    $authProvider.github({
      url: '/auth/github',
      clientId: '0bdbfce267f504280812',
      redirectUri: 'http://127.0.0.1:3000/auth/github/callback'
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
  .constant("errors", {
    POLL_NAME_ERR: 'You must enter a name for your poll.',
    POLL_OPTIONS_ERR: 'You must enter at least two options for your poll.'
  })
  .run(function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  });
