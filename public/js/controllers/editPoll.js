angular.module('Votapalooza')
  .controller('EditPollCtrl', function($scope, $rootScope, $routeParams, Poll) {
    $scope.profile = $rootScope.currentUser;

    $scope.deletePoll = function() {
        Poll.deletePoll($scope.poll._id)
            .then(function(response) {
                $scope.poll = {};
            }, function(response) {
                console.log(response);
            });
    };

    $scope.addOption = function() {
        $scope.poll.options.push({});
    };

    $scope.saveUpdates = function() {
        Poll.updatePoll($scope.poll._id, $scope.poll)
            .then(function(response) {
                $scope.poll = response.data;
            }, function(response) {
                console.log(response);
            });
    };
    
    Poll.getPoll($routeParams.id)
        .then(function(response) {
            $scope.poll = response.data;
        }, function(response) {
            console.log('Error');
            console.log(response);
        });
  });
