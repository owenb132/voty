angular.module('Votapalooza')
  .controller('EditPollCtrl', function($window, $scope, $routeParams, $http, errors, Poll, User) {
    $scope.profile = User.getCurrentUser();

    $scope.$watch(User.getCurrentUser, function(user) {
        $scope.profile = user;
    }, true);

    $scope.loading = true;

    $scope.deletePoll = function() {
        Poll.deletePoll($scope.poll._id)
            .then(function(response) {
                $scope.poll = {};

                $scope.messages = {
                    success: response.data.msg
                };

                User.setCurrentUser(response.data.user);
                
            }, function(response) {
                $scope.messages = {
                    error: response.data.msg
                };
            });
    };

    $scope.addOption = function() {
        $scope.poll.options.push({});
    };

    $scope.saveUpdates = function() {
        $scope.messages = {};

        if (!$scope.poll.text) {
            $scope.messages = {
                error: errors.POLL_NAME_ERR
            };
        }

        if ($scope.poll.options.filter(function(opt) { return opt.text.length > 0 }).length < 2) {
            $scope.messages = {
                error: errors.POLL_OPTIONS_ERROR
            };
        }

        if (!$scope.messages.error) {
            Poll.updatePoll($scope.poll._id, $scope.poll)
                .then(function(response) {
                    $scope.poll = response.data.poll;

                    $scope.messages = {
                        success: response.data.msg
                    };

                }, function(response) {
                    $scope.messages = {
                        error: response.data.msg
                    };
                });
        }
    };
    
    Poll.getPoll($routeParams.id)
        .then(function(response) {
            $scope.loading = false;
            $scope.poll = response.data.poll;

        }, function(response) {
            $scope.messages = {
                error: response.data.msg
            };
        });
  });
