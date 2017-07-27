angular.module('Votapalooza')
  .controller('HomeCtrl', function($scope, Poll) {
    Poll.getAll()
    	.then(function(response) {
    		$scope.polls = response.data;
    	}, function(response) {
    		console.log(response);
    	});
  });