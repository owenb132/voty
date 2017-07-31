angular.module('Votapalooza')
    .controller('ViewPollCtrl', function($window, $location, $scope, $routeParams, $http, User, Vote, Poll, Account) {
        $scope.profile = User.getCurrentUser();
        $scope.baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port();
        console.log($scope.profile);
        
        $scope.voted = false;
        $scope.data = {
            choice: ''
        };

        $scope.$watch(User.getCurrentUser, function(user) {
            $scope.profile = user;
        }, true);

        $scope.vote = function(choice) {
            var optionIndex = $scope.poll.options.findIndex(function(opt) { return opt.text === choice });
            var myVote = {
                user: $scope.profile._id,
                poll: $scope.poll._id,
                choice: choice
            };

            // Save vote to db
            Vote.createVote(myVote)
                .then(function(response) {
                    // Add vote to poll model
                    $scope.poll.options[optionIndex].votes.push(response.data._id);

                    // Add vote to user model
                    $scope.profile.votes.push(response.data._id);

                    // Save updated poll to db
                    Poll.updatePoll($scope.poll._id, $scope.poll)
                        .then(function(response) {
                            // Update poll in view
                            $scope.poll = response.data;
                            $scope.voted = true;
                        }, function(response) {
                            console.log(response);
                        });

                    // Save updated user to db
                    Account.updateUser($scope.profile._id, $scope.profile)
                        .then(function(response) {
                            $scope.success = 'Successfully logged vote!';
                            User.setCurrentUser(response.data);
                        }, function(response) {
                            console.log(response);
                        });
                });
        };

        $scope.deletePoll = function() {
            async.series([
                function(callback) {
                    // For each option in this poll
                    $scope.poll.options.forEach(function(opt) {

                        // For each vote for this option
                        opt.votes.forEach(function(vote) {

                            async.series([
                                function(callback) {
                                    // Remove the vote from the user and update the user in the db
                                    $scope.deleteVoteFromUser(vote, callback);
                                },
                                function(callback) {
                                    // Then remove the vote from the db
                                    $scope.deleteVoteFromDB(vote, callback);
                                }
                            ],
                            function(err, results) {
                                if (err) {
                                    console.log(err);
                                    callback(err);
                                }

                                if (results) {
                                    callback(null, results);
                                }
                            });                           
                        });
                    });
                },
                function(callback) {
                    // Once all the votes are deleted, delete the poll
                    $scope.deletePollFromDB(callback);                    
                }
            ], 
                function(err, results) {
                if (err) {
                    console.log(err);
                    callback(err);
                }
                if (results) console.log(results);
            });
        };

        $scope.deleteVoteFromUser = function(voteId, callback) {
            // Get the vote's user
            Vote.getUser(voteId)
                .then(function(response) {
                    var user = response.data.user;

                    // Remove the vote from the user's votes list
                    user.votes = user.votes.filter(function(userVote) {
                        return userVote !== voteId;
                    });

                    // Save updated user to db
                    Account.updateUser(user._id, user)
                        .then(function(response) {
                            if ($scope.profile._id === response.data._id) {
                                User.setCurrentUser(response.data);
                            }
                            callback(null, response.data);
                        }, function(response) {
                            console.log(response);
                            callback(response);
                        });
                });
        };

        $scope.deleteVoteFromDB = function(voteId, callback) {
            // Delete vote from db
            Vote.deleteVote(voteId)
                .then(function(response) {
                    callback(null, 'Vote successfully deleted.');
                }, function(response) {
                    console.log(response);
                    callback(response);
                });
        }

        $scope.deletePollFromDB = function(callback) {
            // Delete poll from db
            Poll.deletePoll($scope.poll._id)
                .then(function(response) {
                    $scope.poll = {};

                    // Remove poll id from user poll list
                    var pollIndex = $scope.profile.polls.findIndex(function(poll) { return poll._id === $scope.poll._id });
                    $scope.profile.polls.splice(pollIndex, 1);

                    // Save updated user to db
                    Account.updateUser($scope.profile._id, $scope.profile).then(function(response) {
                        User.setCurrentUser(response.data);
                        $scope.success = 'Poll deleted successfully!';
                        $scope.poll = {};
                        callback(null, response.data);
                    }, function(response) {
                        $scope.error = `Error deleting poll: ${response.status} ${response.statusText}`;
                        callback(response);
                    });

                }, function(response) {
                    callback(response);
                });
        };

        $scope.checkAlreadyVoted = function() {
            if ($scope.profile) {
                Account.myVotes()
                    .then(function(response) {
                        $scope.voted = response.data.votes.some(function(vote) { return vote.poll === $scope.poll._id });
                    }, function(response) {
                        console.log(response);
                    });
            }
        };

        // Get one poll from db
        Poll.getPoll($routeParams.id)
            .then(function(response) {
                // Update the view with the response
                $scope.poll = response.data;
                $scope.checkAlreadyVoted();
            }, function(response) {
                console.log('Error');
                console.log(response);
            });
    });