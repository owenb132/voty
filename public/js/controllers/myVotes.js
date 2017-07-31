angular.module('Votapalooza')
  .controller('VotesCtrl', function($scope, $rootScope, $location, Account, Vote) {
    $scope.votes = [];
    $scope.baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    $scope.getVotes = function() {     
        Account.myVotes()
            .then(function (response) {
                var votes = response.data.votes;
                async.each(votes, function(vote, callback) {
                    Vote.getPoll(vote._id)
                        .then(function(response) {
                            $scope.votes.push({ choice: vote.choice, poll: response.data.poll });
                            console.log(response.data);
                            callback(null, response.data.poll);
                        }, function(response) {
                            callback(response);
                        });
                })
            }, function (response) {
                $scope.error = `Error retrieving votes: ${response.status} ${response.statusText}`;
                console.log(response);
            });
    }

    $scope.getVotes();
  });
