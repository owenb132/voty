angular.module('Votapalooza')
  .controller('VotesCtrl', function($scope, $rootScope, Account) {
    $scope.votes = [];

    $scope.getVotes = function() {     
        Account.myVotes()
            .then(function (response) {
                $scope.votes = response.data.votes;
            }, function (response) {
                $scope.error = `Error retrieving votes: ${response.status} ${response.statusText}`;
                console.log(response);
            });
    }

    $scope.getVotes();
  });
