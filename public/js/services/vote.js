angular.module('Votapalooza')
  .factory('Vote', function($http) {
    return {
      getAll: function() {
        return $http.get('/api/votes');
      },

      getVote: function(voteId) {
      	return $http.get('/api/votes/' + voteId);
      },

      createVote: function(data) {
      	return $http.post('/api/votes', data);
      },

      updateVote: function(voteId, data) {
      	return $http.patch('/api/votes/' + voteId, data);
      },

      deleteVote: function(voteId) {
      	return $http.delete('/api/votes/' + voteId);
      },

      getUser: function(voteId) {
        return $http.get('/api/votes/' + voteId + '/user');
      },
      getPoll: function(voteId) {
        return $http.get('/api/votes/' + voteId + '/poll');
      }
    };
  });