angular.module('Votapalooza')
  .controller('PollsCtrl', function($scope, $location, $rootScope, Account) {
    $scope.polls = [];
    $scope.baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port();

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
