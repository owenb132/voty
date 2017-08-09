angular.module('Voty')
  .controller('CreatePollCtrl', function($window, $scope, $location, $http, $auth, errors, Account, Poll, User) {
  	$scope.profile = User.getCurrentUser();
    console.log($scope.profile);

    $scope.$watch(User.getCurrentUser, function(user) {
        $scope.profile = user;
    }, true);

  	$scope.placeholders = ['Coke', 'Pepsi'];

  	$scope.newPoll = {
        owner: $scope.profile._id,
        options: []
    };

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    /* Add an option when creating a poll */
    $scope.addOption = function () {
        $scope.placeholders.push('New Option');
    };

    /* Remove an option when creating a poll */
    $scope.removeOption = function (index) {
        $scope.placeholders.splice(index, 1);
    };

    /* User creates a poll */
    $scope.createPoll = function () {

    	$scope.messages = {};

        if (!$scope.newPoll.text) {
            $scope.messages = {
                error: errors.POLL_NAME_ERR
            };
        }

        // All polls require at least 2 options to choose between
        if ($scope.newPoll.options.filter(function(opt) { return opt.text.length > 0 }).length < 2) {
            $scope.messages = {
                error: errors.POLL_OPTIONS_ERR
            };
        }

        if (!$scope.messages.error) {

            // Save new poll to db
		    Poll.createPoll($scope.newPoll)
		        .then(function (response) {
                    // Reset new poll
		            $scope.newPoll = {
                        owner: $scope.profile._id,
                        options: []
                    };

                    $scope.messages = {
                        success: response.data.msg
                    };
                    
                    // Update local user
                    User.setCurrentUser(response.data.user);
		        
		        }, function (response) {
		            $scope.messages = {
                        error: response.data.msg
                    };
		        });
	    }
    };
  });
