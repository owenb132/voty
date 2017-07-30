angular.module('Votapalooza')
  .controller('ViewPollCtrl', function($scope, $rootScope, $routeParams, $http, Vote, Poll, Account) {
    $scope.profile = $rootScope.currentUser;

    $scope.vote = function() {
        console.log($scope.choice);
        // var optionIndex = $scope.poll.options.findIndex(function(opt) { return opt.text === choice });
        // var myVote = {
        //     user: $scope.profile._id,
        //     poll: $scope.poll._id,
        //     choice: choice
        // };

        // Vote.createVote(myVote)
        //     .then(function(response) {
        //         $scope.poll.options[optionIndex].votes.push(response.data._id);
        //         $scope.profile.votes.push(response.data._id);
        //         console.log(response);

        //         Poll.updatePoll($scope.poll._id, $scope.poll)
        //             .then(function(response) {
        //                 console.log(response);
        //                 $scope.poll = response.data;
        //             }, function(response) {
        //                 console.log(response);
        //             });

        //         Account.updateAccount($scope.profile)
        //             .then(function(response) {
        //                 console.log(response);
        //             }, function(response) {
        //                 console.log(response);
        //             });
        //     });
    };

    $scope.deletePoll = function() {
        Poll.deletePoll($scope.poll._id)
            .then(function(response) {
                $scope.poll = {};
                $scope.profile.polls.splice($scope.profile.polls.findIndex(function(el) { return el._id === $scope.poll._id }), 1);

                // Update user's polls list
                $http.put('/account', $scope.profile).then(function(response) {
                        $scope.success = 'Poll deleted successfully!';
                        console.log(response);
                    }, function (response) {
                        $scope.error = `Error deleting poll: ${response.status} ${response.statusText}`;
                        console.log(response);
                    });

            }, function(response) {
                console.log(response);
            });
    };
    
    Poll.getPoll($routeParams.id)
        .then(function(response) {
            $scope.poll = response.data;
            $scope.voted = $scope.profile.votes.indexOf($scope.poll._id) > -1;
        }, function(response) {
            console.log('Error');
            console.log(response);
        });
  });
