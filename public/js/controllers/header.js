angular.module('Votapalooza')
  .controller('HeaderCtrl', function($scope, $location, $window, $auth, User) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      User.setCurrentUser({});
      $location.path('/');
    };
    // Initialize Foundation
    $(document).foundation();
  });
