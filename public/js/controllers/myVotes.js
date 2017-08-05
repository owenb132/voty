angular.module('Votapalooza')
  .controller('VotesCtrl', function($scope, Account, User) {
    $scope.profile = User.getCurrentUser();
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
