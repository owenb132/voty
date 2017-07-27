angular.module('Votapalooza')
  .controller('ViewPollCtrl', function($scope, $rootScope, $routeParams, Poll) {
    $scope.profile = $rootScope.currentUser;

    $scope.deletePoll = function() {
        console.log($scope.poll);
        Poll.deletePoll($scope.poll._id)
            .then(function(response) {
                $scope.poll = {};
                console.log(response);
            }, function(response) {
                console.log(response);
            });
    };
    
    Poll.getPoll($routeParams.id)
        .then(function(response) {
            $scope.poll = response.data;
            console.log(response);
        }, function(response) {
            console.log('Error');
            console.log(response);
        });
  });
