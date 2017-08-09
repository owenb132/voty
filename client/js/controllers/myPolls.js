angular.module('Voty')
  .controller('PollsCtrl', function($scope, Account, User) {
    $scope.profile = User.getCurrentUser();

    $scope.loading = true;
    $scope.polls = [];

    $scope.getPolls = function() {     
        User.myPolls()
            .then(function (response) {
                $scope.loading = false;
                $scope.polls = response.data.polls;
                $scope.messages = {
                    success: response.data.msg
                };
                
            }, function (response) {
                $scope.messages = {
                    error: response.data.msg
                };
            });
    }

    $scope.getPolls();
  });
