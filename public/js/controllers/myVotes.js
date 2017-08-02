angular.module('Votapalooza')
  .controller('VotesCtrl', function($scope, $rootScope, Account, Vote, Poll) {
    $scope.votes = [];

    $scope.getVotes = function() {    
        // Get all votes for this user 
        Account.myVotes()
            .then(function (response) {
                var votes = response.data.votes;

                // For each vote
                async.each(votes, function(vote, callback) {

                    // Get the poll information
                    Vote.getPoll(vote._id)
                        .then(function(response) {
                            vote.poll = response.data.poll;

                            // Then get the owner information for this poll
                            Poll.getOwner(vote.poll._id)
                                .then(function(response) {
                                    vote.poll.owner = response.data.owner;
                                    $scope.votes.push(vote);

                                    // Let async know we've got all the information
                                    callback(null, response.data.owner);
                                }, function(response) {
                                    $scope.messages = {
                                        error: [response.data]
                                    };
                                });
                        }, function(response) {
                            $scope.messages = {
                                error: [response.data]
                            };

                            callback(response);
                        });
                });
            }, function(response) {
                $scope.messages = {
                    error: [response.data]
                };
            });
    }

    $scope.getVotes();
  });
