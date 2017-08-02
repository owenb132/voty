'use strict';

var _ = require('lodash');
var async = require('async');
var Poll = require('../models/Poll');
var Vote = require('../models/Vote');
var User = require('../models/User');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

exports.index = function(req, res) {
	return Poll.find().exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
};

exports.mostRecentN = function(req, res) {
  var n = req.body.n;

  return Poll.find().sort({"createdAt": -1}).limit(n).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
};

exports.getUser = function(req, res) {
  return Poll.findById(req.params.id)
    .populate('owner').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

exports.show = function(req, res) {
	return Poll.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
};

exports.create = function(req, res) {
  var user = req.user;
  var poll = req.body;

	Poll.create(poll)
		.then(function(result) {
      user.polls.push(result._id);

      return User.findByIdAndUpdate(user._id, user, { new: true }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
    })
		.catch(handleError(res));
};

exports.patch = function(req, res) {
  return Poll.findOneAndUpdate({
    _id: req.params.id
  }, 
    req.body, 
  {
    new: true
  }
  ).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

exports.destroy = function(req, res) {
  var user = req.user;
  var votes = [];

	Poll.findById(req.params.id)
    .populate('owner').exec()
		.then(handleEntityNotFound(res))
		.then(function(poll) {

      async.series([
        // First handle all the votes in the poll
        function(callback) {
          async.each(poll.options, function(option, optionsCallback) {

            if (option.votes.length > 0) {
              async.each(option.votes, function(voteId, votesCallback) {
                Vote.findById(voteId)
                  .populate('user').exec()
                  .then(handleEntityNotFound(res))
                  .then(function(vote) {

                    async.parallel([
                      // Remove vote from user
                      function(callback) {
                        deleteVoteFromUser(vote, res, callback);
                      },

                      // Remove vote from db
                      function(callback) {
                        deleteVoteFromDb(vote, callback);
                      }
                    ], 

                    // Processed this vote
                    function(err, results) {
                      if (err) {
                        callback(err);
                      } else if (results) {
                        votesCallback(results);
                      }
                    });
                  })
                  .catch(handleError(res));

                // Processed all votes for this option
                }, function(err) {
                  if (!err) {
                    optionsCallback();
                  } else {
                    optionsCallback(err);
                  }
                });
            } else {
              optionsCallback(); // No votes for this option
            }

          // Processed all options for this poll
          }, function(err) {
            if (!err) {
              callback();
            } else {
              callback(err);
            }
          });
        },

        // Handle the poll itself
        function(callback) {
          async.parallel([
            // Remove poll from user
            function(callback) {
              deletePollFromUser(poll, res, callback);
            },

            // Remove poll from db
            function(callback) {
              deletePollFromDb(poll, callback);
            }
          ],
            // Poll operations complete
            function(err, results) {
              if (err) {
                callback(err);
              } else if (results) {
                callback(null, results);
              }
          });
        },
      ],
        // All operations complete
        function(err, results) {
          if (err) res.status(500).send(err);
          if (results) {
            var resultArr = _.flattenDeep(results);

            /* 
            * Get user from results array.
            * Since we don't pass anything else to the callbacks in this async method, 
            * user will be the only thing in the callbacks results array (most likely a 
            * better way to do this).
            */
            var updatedUser = resultArr
              .filter(el => el !== undefined)[0];

            res.status(200).json(updatedUser);
          }
        });
    })
    .catch(handleError(res));
};

function deleteVoteFromUser(vote, res, callback) {
  var voter = vote.user;
  voter.votes.splice(voter.votes.findIndex(el => el._id === vote._id), 1);

  User.findByIdAndUpdate(voter._id, { votes: voter.votes }, { new: true }).exec()
    .then(handleEntityNotFound(res))
    .then(function(user) {
      callback(null, user);
    })
    .catch(function(err) {
      callback(err);
    });
}

function deleteVoteFromDb(vote, callback) {
  vote.remove()
    .then(function(vote) {
      callback(null, vote);
    })
    .catch(function(err) {
      callback(err);
    });
}

function deletePollFromUser(poll, res, callback) {
  var user = poll.owner;
  user.polls.splice(user.polls.findIndex(el => el._id === poll._id), 1);

  return User.findByIdAndUpdate(user._id, { polls: user.polls }, { new: true }).exec()
    .then(handleEntityNotFound(res))
    .then(function(user) {
      callback(null, user); // Return the updated user so that we can access it in the view's controller
    })
    .catch(function(err) {
      callback(err);
    });
}

function deletePollFromDb(poll, callback) {
  poll.remove()
    .then(function(poll) {
      callback();
    })
    .catch(function(err) {
      callback(err);
    });
}
