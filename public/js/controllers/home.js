angular.module('Votapalooza')
  .controller('HomeCtrl', function($scope, Poll) {
    Poll.getMostRecent()
    	.then(function(response) {
    		$scope.polls = response.data;
    	}, function(response) {
    		$scope.messages = {
    			error: [response.data]
    		};
    	});
  });
