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

        // Get one poll from db
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
                        console.log(response);
                    });

            }, function(response) {
                console.log('Error');
                console.log(response);
            });
    });