angular.module('Votapalooza')
  .factory('User', function($window, $http) {
    var currentUser = {};

    if ($window.localStorage.user) {
      currentUser = JSON.parse($window.localStorage.user);
    }

    return {
      setCurrentUser: function(user) {
        currentUser = user;
        $window.localStorage.user = JSON.stringify(user);
      },
      getCurrentUser: function() {
        return currentUser;
      }
    };
  });