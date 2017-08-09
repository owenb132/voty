angular.module('Voty')
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
      resetPassword: function(data, token) {
        return $http.post('/reset/' + token, data);
      }
    };
  });