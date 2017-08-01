angular.module('Votapalooza')
  .factory('Account', function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      updateUser: function(userId, data) {
        return $http.patch('/users/' + userId, data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      },
      myPolls: function() {
        return $http.get('/me/polls');
      },
      myVotes: function() {
        return $http.get('me/votes');
      }
    };
  });