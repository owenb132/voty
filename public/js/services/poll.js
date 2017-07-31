angular.module('Votapalooza')
  .factory('Poll', function($http) {
    return {
      getAll: function() {
        return $http.get('/api/polls');
      },

      getPoll: function(pollId) {
      	return $http.get('/api/polls/' + pollId);
      },

      createPoll: function(data) {
      	return $http.post('/api/polls', data);
      },

      updatePoll: function(pollId, data) {
      	return $http.patch('/api/polls/' + pollId, data);
      },

      deletePoll: function(pollId) {
      	return $http.delete('/api/polls/' + pollId);
      },

      getUser: function(pollId) {
        return $http.get('/api/polls/' + pollId + '/user');
      }
    };
  });