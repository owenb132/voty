angular.module('Votapalooza')
    .controller('ViewPollCtrl', function($window, $location, $scope, $routeParams, $http, User, Vote, Poll, Account) {
        $scope.profile = User.getCurrentUser();

        $scope.$watch(User.getCurrentUser, function(user) {
            $scope.profile = user;
        }, true);

        $scope.input = { choice: '' };
        $scope.loading = true;
        $scope.voted = false;
        $scope.data = [];

        $scope.vote = function(choice) {
            $scope.loading = true;

            var isAuthenticated = !_.isEmpty($scope.profile);

            var myVote = {
                poll: $scope.poll._id,
                choice: choice,
                authenticated: isAuthenticated // Needs to be passed to the server because that's where we get the user's ip if they are not logged in
            };

            Vote.saveVote(myVote)
                .then(function(response) {
                    if (isAuthenticated) User.setCurrentUser(response.data.user);

                    $scope.voted = true;
                    $scope.loading = false;

                    $scope.poll = response.data.poll;

                    var data = $scope.getPollVoteData($scope.poll);
                    $scope.values = data.values;
                    $scope.labels = data.labels;
                
                    $scope.messages = {
                        success: response.data.msg
                    };
                }, function(response) {
                    $scope.messages = {
                        error: response.data.msg
                    };
                });
        };

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

        $scope.checkAlreadyVoted = function(poll) {
            // Search user votes for this poll
            if (!_.isEmpty($scope.profile)) {
                Account.myVotes()
                    .then(function(response) {
                        $scope.voted = response.data.votes.some(function(vote) { return vote.poll._id === poll._id });
                        $scope.loading = false;

                    }, function(response) {
                        $scope.messages = {
                            error: response.data.msg
                        };
                    });
            } else {
                // Search votes made by this IP address for this poll
                Vote.findByIp()
                    .then(function(response) {
                        $scope.voted = response.data.votes.some(function(vote) { return vote.poll === poll._id });
                        $scope.loading = false;
                        
                    }, function(response) {
                        $scope.messages = {
                            error: response.data.msg
                        };
                    });
            }
        };

        $scope.getPollVoteData = function(poll) {
            return {
                values: poll.options.map(function(opt) { return opt.votes.length; }),
                labels: poll.options.map(function(opt) { return opt.text; })
            };
        };

        // Retrieve poll information using id in url
        Poll.getPoll($routeParams.id)
            .then(function(response) {
                // Update the view with the response
                $scope.poll = response.data.poll;
                $scope.checkAlreadyVoted($scope.poll);

                var data = $scope.getPollVoteData($scope.poll);
                $scope.values = data.values;
                $scope.labels = data.labels;

                // Get poll creator
                Poll.getOwner($scope.poll._id)
                    .then(function(response) {
                        $scope.pollCreator = response.data.poll.owner;

                    }, function(response) {
                        $scope.messages = {
                            error: response.data.msg
                        };
                    });

            }, function(response) {
                $scope.messages = {
                    error: response.data.msg
                };
            });
    });