angular.module('Votapalooza')
  .controller('ViewPollCtrl', function($scope, $rootScope, $routeParams, $http, Poll) {
    $scope.profile = $rootScope.currentUser;

    $scope.deletePoll = function() {
        Poll.deletePoll($scope.poll._id)
            .then(function(response) {
                $scope.poll = {};
                $scope.profile.polls.splice($scope.profile.polls.findIndex(function(el) { return el._id === $scope.poll._id }), 1);

                $http.put('/account', $scope.profile).then(function(response) {
                        $scope.success = 'Poll deleted successfully!';
                        console.log(response);
                    }, function (response) {
                        $scope.error = `Error deleting poll: ${response.status} ${response.statusText}`;
                        console.log(response);
                    });

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
