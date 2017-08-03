angular.module('Votapalooza')
  .controller('HomeCtrl', function($scope, Poll) {
    $scope.loading = true;

    Poll.getMostRecent()
    	.then(function(response) {
            $scope.loading = false;
    		$scope.polls = response.data;
    	}, function(response) {
    		$scope.messages = {
    			error: [response.data]
    		};
    	});
  });
