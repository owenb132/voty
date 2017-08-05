angular.module('Votapalooza')
  .controller('CreatePollCtrl', function($window, $scope, $location, $http, $auth, errors, Account, Poll, User) {
  	$scope.profile = User.getCurrentUser();

    $scope.$watch(User.getCurrentUser, function(user) {
        $scope.profile = user;
    }, true);

  	$scope.placeholders = ['Coke', 'Pepsi'];

  	if ($scope.profile) {
	  	$scope.newPoll = {
	        owner: $scope.profile._id,
	        options: []
	    };
	}

    $scope.errors = {
        name: '',
        options: ''
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

    	$scope.errors.name = '';
        $scope.errors.options = '';

        if (!$scope.newPoll.text) {
            $scope.errors.name = errors.POLL_NAME_ERR;
        }

        if ($scope.newPoll.options.filter(function(opt) { return opt.text.length > 0 }).length < 2) {
            $scope.errors.options = errors.POLL_OPTIONS_ERR;
        }

        if ($scope.errors.name.length === 0 && $scope.errors.options.length === 0) {

		    Poll.createPoll($scope.newPoll)
		        .then(function (response) {
                    // Reset new poll
		            $scope.newPoll = {
                        owner: $scope.profile._id,
                        options: []
                    };

                    // Update local user
                    User.setCurrentUser(response.data);
		        
		        }, function (response) {
		            $scope.error = `Error creating poll: ${response.status} ${response.statusText}`;
		        });
	    }
    };
  });
