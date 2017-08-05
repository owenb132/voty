angular.module('Voty')
  .controller('SignupCtrl', function($scope, $rootScope, $location, $window, $auth, User) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          User.setCurrentUser(response.data.user);
          $auth.setToken(response);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          User.setCurrentUser(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  });