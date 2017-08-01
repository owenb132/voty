angular.module('Votapalooza')
  .controller('PollsCtrl', function($scope, $location, Account, User) {
    $scope.profile = User.getCurrentUser();
    $scope.polls = [];

    $scope.getPolls = function() {     
        Account.myPolls()
            .then(function (response) {
                $scope.polls = response.data.polls;
            }, function (response) {
                $scope.error = `Error retrieving poll: ${response.status} ${response.statusText}`;
                console.log(response);
            });
    }

    $scope.getPolls();
  });
