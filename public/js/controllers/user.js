angular.module('Votapalooza')
  .controller('UserCtrl', function($scope, $routeParams, Account, User, Vote) {
  	$scope.user = {};
  	$scope.polls = [];
  	$scope.votes = [];

  	async.parallel([
  		function(callback) {
        // Get this user's polls
  			Account.getPolls($routeParams.id)
  				.then(function(response) {
  					$scope.polls = response.data.polls;
  					callback(response.data.polls);
  				}, function(response) {
  					callback(response);
  				});
  		},
  		function(votesCallback) {
        // Get this user's votes
  			Account.getVotes($routeParams.id)
  				.then(function(response) {
  					var votes = response.data.votes;
  					
            // For each vote get the poll information
            async.each(votes, function(vote, callback) {
              Vote.getPoll(vote._id)
                .then(function(response) {
                  $scope.votes.push({ choice: vote.choice, poll: response.data.poll });

                  // Got this poll's information
                  callback(null, response.data.poll);
                }, function(response) {
                  callback(response);
                });
            }, function(err, results) {
              if (err) {
                $scope.messages = { error: err };
                votesCallback(err);
              }

              // Let async know that we've got all the votes and poll information
              if (results) return votesCallback(null, results);
            });
  				}, function(response) {
  					callback(response);
  				});
  		},
  		function(callback) {
        // Get this user's full information
  			User.getUser($routeParams.id)
  				.then(function(response) {
  					$scope.user = response.data;
  					callback(null, response.data.user);
  				}, function(response) {
  					callback(response.data);
  				});
  		}
  	], 

    // All async tasks finished
    function(err, results) {
      $scope.message = {
        error: err
      }
    });
  });
