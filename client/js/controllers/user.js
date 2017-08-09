angular.module('Voty')
  .controller('UserCtrl', function($scope, $routeParams, Account, User, Vote) {
  	$scope.user = {};
  	$scope.polls = [];
  	$scope.votes = [];
    $scope.loading = true;

  	async.parallel([

      // Get this user's polls
  		function(callback) {
        getUserPolls($routeParams.id, callback)
  		},

  		function(callback) {
        // Get this user's votes
  			User.getVotes($routeParams.id)
  				.then(function(response) {
  					var votes = response.data.votes;

  					if (votes.length > 0) {
              // For each vote get the poll information
              async.map(votes, getPollInformation, function(err, results) {
                if (err) {
                  callback(err);
                } else if (results) {
                  callback(null, results);
                }
              });
            } else {
              callback(null, []);
            }
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
      if (err) {
        $scope.message = {
          error: err
        }
      } else if (results) {
        $scope.polls = results[0];
        $scope.votes = results[1];
        $scope.user = results[2];
        // console.log($scope.user);
        $scope.loading = false;
      }
    });

    function getUserPolls(userId, callback) {
      User.getPolls(userId)
        .then(function(response) {
          console.log(response.data);
          callback(null, response.data.polls);
        }, function(response) {
          callback(response);
        });
    }

    function getPollInformation(vote, callback) {
      Vote.getPoll(vote._id)
        .then(function(response) {
          callback(null, response.data);
        }, function(response) {
          callback(response);
        });
    }

    function getUserInformation(userId, callback) {
      User.getUser(userId)
          .then(function(response) {
            console.log(response.data);
            callback(null, response.data);
          }, function(response) {
            callback(response.data);
          });
    }
  });
