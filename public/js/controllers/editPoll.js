angular.module('Votapalooza')
  .controller('EditPollCtrl', function($scope, $rootScope, $routeParams, $http, Poll) {
    $scope.profile = $rootScope.currentUser;

    $scope.errors = {
        name: {
            message: ''
        },
        options: {
            message: ''
        }
    };

    var NEW_POLL_NAME_ERROR = 'You must enter a name for your poll.';
    var NEW_POLL_OPTIONS_ERROR = 'You must enter at least two options for your poll.';

    $scope.deletePoll = function() {
        Poll.deletePoll($scope.poll._id)
            .then(function(response) {
                $scope.poll = {};
                $scope.profile.polls.splice($scope.profile.polls.findIndex(function(el) { return el._id === $scope.poll._id }), 1);

                // Update user's polls list
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

    $scope.addOption = function() {
        $scope.poll.options.push({});
    };

    $scope.saveUpdates = function() {
        $scope.errors.name.message = '';
        $scope.errors.options.message = '';

        if (!$scope.poll.text) {
            $scope.errors.name.message = NEW_POLL_NAME_ERROR;
        }

        if ($scope.poll.options.filter(function(opt) { return opt.text.length > 0 }).length < 2) {
            $scope.errors.options.message = NEW_POLL_OPTIONS_ERROR;
        }

        if ($scope.errors.name.message.length === 0 && $scope.errors.options.message.length === 0) {
            Poll.updatePoll($scope.poll._id, $scope.poll)
                .then(function(response) {
                    $scope.poll = response.data;
                }, function(response) {
                    console.log(response);
                });
        }
    };
    
    Poll.getPoll($routeParams.id)
        .then(function(response) {
            $scope.poll = response.data;
        }, function(response) {
            console.log('Error');
            console.log(response);
        });
  });
