angular.module('Votapalooza')
  .controller('PollsCtrl', function($scope, $rootScope, Poll) {
    $scope.profile = $rootScope.currentUser;
    $scope.polls = [];

    $scope.getPolls = function() {
    	angular.forEach($scope.profile.polls, function (poll) {
            Poll.getPoll(poll._id)
	            .then(function (response) {
	                $scope.polls.push(response.data);
	            }, function (response) {
	                $scope.error = `Error retrieving poll: ${response.status} ${response.statusText}`;
	            });
        });
    }

    $scope.getPolls();
  });
