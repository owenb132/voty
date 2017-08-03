angular.module('Votapalooza')
    .controller('ViewPollCtrl', function($window, $location, $scope, $routeParams, $http, User, Vote, Poll, Account) {
        $scope.profile = User.getCurrentUser();

        $scope.voted = false;
        $scope.data = {
            choice: ''
        };

        $scope.$watch(User.getCurrentUser, function(user) {
            $scope.profile = user;
        }, true);

        $scope.vote = function(choice) {
            var myVote = {
                user: $scope.profile._id,
                poll: $scope.poll._id,
                choice: choice
            };

            Vote.saveVote(myVote)
                .then(function(response) {
                    User.setCurrentUser(response.data.user);
                    $scope.voted = true;
                    $scope.poll = response.data.poll;
                    $scope.messages = {
                        success: [response.data]
                    };
                }, function(response) {
                    $scope.messages = {
                        error: [response.data]
                    };
                });
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
                        error: [response.data]
                    };
                });
        };

        $scope.checkAlreadyVoted = function() {
            if ($scope.profile._id) {
                Account.myVotes()
                    .then(function(response) {
                        $scope.voted = response.data.votes.some(function(vote) { return vote.poll === $scope.poll._id });
                    }, function(response) {
                        console.log(response);
                    });
            }
        };

        // Retrieve poll information using id in url
        Poll.getPoll($routeParams.id)
            .then(function(response) {
                // Update the view with the response
                $scope.poll = response.data;
                $scope.checkAlreadyVoted();

                // Get poll creator
                Poll.getOwner(response.data._id)
                    .then(function(response) {
                        $scope.pollCreator = response.data.owner;
                    }, function(response) {
                        $scope.messages = {
                            error: [response.data]
                        };
                    });

            }, function(response) {
                $scope.messages = {
                    error: [response.data]
                };
            });
    });