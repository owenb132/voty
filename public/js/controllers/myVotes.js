angular.module('Votapalooza')
  .controller('VotesCtrl', function($scope, $rootScope, Account, Vote, Poll) {
    $scope.loading = true;
    $scope.votes = [];

    $scope.getVotes = function() {    
        // Get all votes for this user 
        Account.myVotes()
            .then(function(response) {
                $scope.loading = false;
                $scope.votes = response.data.votes;
                $scope.messages = {
                    success: response.data.msg
                };

            }, function(response) {
                $scope.messages = {
                    error: [response.data]
                };
            });
    }

    $scope.getVotes();
  });
