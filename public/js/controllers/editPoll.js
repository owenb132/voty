angular.module('Votapalooza')
  .controller('EditPollCtrl', function($window, $scope, $routeParams, $http, errors, Poll, User) {
    $scope.profile = User.getCurrentUser();

    $scope.$watch(User.getCurrentUser, function(user) {
        $scope.profile = user;
    }, true);

    $scope.loading = true;

    $scope.errors = {
        name: '',
        options: ''
    };

    $scope.deletePoll = function() {
            Poll.deletePoll($scope.poll._id)
                .then(function(response) {
                    User.setCurrentUser(response.data.user);
                    $scope.messages = {
                        success: [response.data]
                    };
                    
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
            $scope.errors.name = errors.POLL_NAME_ERR;
        }

        if ($scope.poll.options.filter(function(opt) { return opt.text.length > 0 }).length < 2) {
            $scope.errors.options = errors.POLL_OPTIONS_ERROR;
        }

        if ($scope.errors.name.length === 0 && $scope.errors.options.length === 0) {
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
            $scope.loading = false;
            $scope.poll = response.data;
        }, function(response) {
            console.log('Error');
            console.log(response);
        });
  });
