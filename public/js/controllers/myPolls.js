angular.module('Votapalooza')
  .controller('PollsCtrl', function($scope, $location, Account, User) {
    $scope.profile = User.getCurrentUser();
    $scope.loading = true;
    $scope.polls = [];

    $scope.getPolls = function() {     
        Account.myPolls()
            .then(function (response) {
                $scope.loading = false;
                $scope.polls = response.data.polls;
            }, function (response) {
                $scope.messages = {
                    error: [response.data]
                };
            });
    }

    $scope.getPolls();
  });
