angular.module('Votapalooza')
  .factory('User', function($window, $http) {
    var currentUser;
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