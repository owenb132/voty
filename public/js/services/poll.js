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

      updatePoll: function(data) {
      	return $http.patch('/api/polls/:id', data);
      },

      deletePoll: function() {
      	return $http.delete('/api/polls/:id');
      }
    };
  });