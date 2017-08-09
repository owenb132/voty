angular.module('Voty')
    .controller('ViewPollCtrl', function($window, $location, $scope, $routeParams, $http, User, Vote, Poll, Account) {

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
                    $scope.choice = myVote.choice;

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

        $scope.checkAlreadyVoted = function(poll, callback) {
            // Search user votes for this poll
            if (!_.isEmpty($scope.profile)) {
                User.myVotes()
                    .then(function(response) {
                        var votes = response.data.votes;
                        var hasVoted = false;
                        var choice = null;

                        votes.forEach(function(vote, index) {
                            if (vote.poll._id === poll._id) {
                                choice = votes[index].choice;
                                hasVoted = true;
                            }
                        });

                        callback(null, { hasVoted: hasVoted, choice: choice });
                        

                    }, function(response) {
                        callback(response.data);
                    });
            } else {
                // Search votes made by this IP address for this poll
                Vote.findByIp()
                    .then(function(response) {
                        var votes = response.data.votes;
                        var choice = '';

                        var hasVoted = votes.some(function(vote, index) {
                            choice = votes[index].choice; 
                            return vote.poll === poll._id; 
                        });

                        callback(null, { hasVoted: hasVoted, choice: choice });
                        
                    }, function(response) {
                        callback(response.data);
                    });
            }
        };

        // Get all the votes data in order to build the chart
        $scope.getPollVoteData = function(poll) {
            return {
                values: poll.options.map(function(opt) { return opt.votes.length; }),
                labels: poll.options.map(function(opt) { return opt.text; })
            };
        };

        // Retrieve poll information using id in url
        $scope.getPoll = function(pollId, callback) {
            Poll.getPoll(pollId)
                .then(function(response) {
                    callback(null, response.data);

                }, function(response) {
                    callback(response.data);
                });
        };

        $scope.getPollCreator = function(poll, callback) {
            Poll.getOwner(poll._id)
                .then(function(response) {
                    callback(null, response.data.poll.owner);

                }, function(response) {
                    callback(response.data);
                });
        }; 

        $scope.init = function() {
            $scope.profile = User.getCurrentUser();

            $scope.$watch(User.getCurrentUser, function(user) {
                $scope.profile = user;
            }, true);

            $scope.input = { choice: '' };
            $scope.loading = true;
            $scope.voted = false;
            
            async.waterfall([
                // First get the poll from the id in the url
                function(callback) {
                    $scope.getPoll($routeParams.id, callback);
                },

                // Then get all the extra data we need
                function(pollResponse, callback) {
                    var poll = pollResponse.poll;

                    async.parallel([
                        // Get poll creator
                        function(_callback) {
                            $scope.getPollCreator(poll, _callback);
                        },

                        // Check if user has already voted
                        function(_callback) {
                            $scope.checkAlreadyVoted(poll, _callback);
                        }
                    ], function(err, results) {
                        if (err) {
                            callback(err);

                        // Got all the data we need
                        } else if (results) {
                            var data           = $scope.getPollVoteData(poll);
                            $scope.pollCreator = results[0];
                            $scope.voted       = results[1].hasVoted;
                            $scope.choice      = results[1].choice;
                            $scope.values      = data.values;
                            $scope.labels      = data.labels;
                            callback(null, pollResponse);
                        }
                    });
                }
            ], function(err, result) {
                if (err) {
                    $scope.messages = {
                        error: err.msg
                    };
                } else if (result) {
                    $scope.loading = false;
                    $scope.poll = result.poll;
                    $scope.messages = {
                        success: result.msg
                    };
                }
            });
        };

        $scope.init();
    });