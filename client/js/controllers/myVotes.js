angular.module('Voty')
  .controller('VotesCtrl', function($scope, Account, User) {
    $scope.profile = User.getCurrentUser();
    console.log($scope.profile);
    $scope.loading = true;
    $scope.votes = [];

    $scope.getVotes = function() {    
        // Get all votes for this user 
        User.myVotes()
            .then(function(response) {
                $scope.loading = false;
                $scope.votes = response.data.votes;

            }, function(response) {
                $scope.messages = {
                    error: response.data.msg
                };
            });
    }

    $scope.getVotes();
  });
