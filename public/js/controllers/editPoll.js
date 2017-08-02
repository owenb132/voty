angular.module('Votapalooza')
  .controller('EditPollCtrl', function($window, $scope, $routeParams, $http, Poll, User) {
    $scope.profile = User.getCurrentUser();

    $scope.errors = {
        name: {
            message: ''
        },
        options: {
            message: ''
        }
    };

    $scope.$watch(User.getCurrentUser, function(user) {
        $scope.profile = user;
    }, true);

    var NEW_POLL_NAME_ERROR = 'You must enter a name for your poll.';
    var NEW_POLL_OPTIONS_ERROR = 'You must enter at least two options for your poll.';

    $scope.deletePoll = function() {
            Poll.deletePoll($scope.poll._id)
                .then(function(response) {
                    User.setCurrentUser(response.data);
                    $scope.poll = {};
                }, function(response) {
                    $scope.messages = {
                        error: response.data
                    };
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
