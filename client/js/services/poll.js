angular.module('Voty')
  .factory('Poll', function($http, User) {
    return {
      getMostRecent: function() {
        return $http.get('/api/polls', { n: 20 });
      },

      getPoll: function(pollId) {
      	return $http.get('/api/polls/' + pollId);
      },

      createPoll: function(poll) {
      	return $http.post('/api/polls', poll);
      },

      updatePoll: function(pollId, data) {
      	return $http.patch('/api/polls/' + pollId, data);
      },

      deletePoll: function(pollId) {
      	return $http.delete('/api/polls/' + pollId);
      },

      getOwner: function(pollId) {
        return $http.get('/api/polls/' + pollId + '/owner');
      }
    };
  });