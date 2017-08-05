angular.module('Voty')
  .controller('UserCtrl', function($scope, $routeParams, Account, User, Vote) {
  	$scope.user = {};
  	$scope.polls = [];
  	$scope.votes = [];

  	async.parallel([

      // Get this user's polls
  		function(callback) {
        getUserPolls($routeParams.id, callback)
  		},

  		function(votesCallback) {
        // Get this user's votes
  			User.getVotes($routeParams.id)
  				.then(function(response) {
  					var votes = response.data.votes;
  					
            // For each vote get the poll information
            async.each(votes, function(vote, callback) {
              getPollInformation(vote, callback);

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

      // Get this user's full information
  		function(callback) {
        getUserInformation($routeParams.id, callback);  			
  		}
  	], 

    // All async tasks finished
    function(err, results) {
      $scope.message = {
        error: err
      }
    });

    function getUserPolls(userId, callback) {
      User.getPolls(userId)
        .then(function(response) {
          $scope.polls = response.data.polls;
          callback(response.data.polls);
        }, function(response) {
          callback(response);
        });
    }

    function getPollInformation(vote, callback) {
      Vote.getPoll(vote._id)
        .then(function(response) {
          $scope.votes.push({ choice: vote.choice, poll: response.data.poll });
          callback(null, response.data.poll);
        }, function(response) {
          callback(response);
        });
    }

    function getUserInformation(userId, callback) {
      User.getUser(userId)
          .then(function(response) {
            $scope.user = response.data;
            callback(null, response.data.user);
          }, function(response) {
            callback(response.data);
          });
    }
  });
