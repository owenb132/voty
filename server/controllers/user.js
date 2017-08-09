var async = require('async');
var User = require('../models/User');
var Poll = require('../models/Poll');
var Vote = require('../models/Vote');

function generateToken(user) {
  var payload = {
    iss: 'my.domain.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

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

// Get all votes for the currently logged in user
exports.myVotes = function(req, res) {
  var userId = req.user._id;

  if (req.user.votes.length > 0) {

    return User.findById(userId)
      .populate('votes').exec()
      .then(handleEntityNotFound(res))
      .then(user => {
          /* The vote objects only contain references to their respective
          * polls' IDs. Need to make more queries to populate the data we
          * need.
          */

          async.map(user.votes, getAllVoteInfo, (err, results) => {
            if (results) {
              res.status(200).send({ msg: 'Successfully retrieved votes.', votes: results });
            } else if (err) {
              res.status(500).send({ msg: 'Error retrieving votes.', err: err });
            }
          });
      })
      .catch(err => { res.status(500).send({ msg: 'Error retrieving votes.', err: err }); });
    } else {
      res.status(200).send({ msg: 'No votes to retrieve.', votes: [] });
    }
};

/* 
* We need all the information for the vote so that we can display
* it in the view in the format "[poll_name] by [poll_owner]".
*/
function getAllVoteInfo(vote, voteCallback, res) {
  /* 
  * We don't have access to the poll's owner, only the user who made
  * the vote. We use waterfall to first get the poll itself, and then
  * get the poll owner from that.
  */
  async.waterfall([
    callback => {
      getPollFromVote(vote, res, callback);
    },

    (poll, vote, callback) => {
      getOwnerFromPoll(poll, vote, res, callback);
    }
  ], (err, result) => {
    if (err) {
      voteCallback(err);

      /* 
      * Result contains the vote object with the poll field populated.
      * That poll field's owner field is in turn populated with the poll
      * owner information.
      */
    } else if (result) {
      voteCallback(null, result);
    }
  });
}

// Get poll information
function getPollFromVote(vote, res, callback) {
  Vote.findById(vote._id)
    .populate('poll').exec()
    .then(handleEntityNotFound(res))
    .then(_vote => {
      /*
      * Add the base poll info to the passed in vote object,
      * and send the updated vote object and the poll through
      * to the next step.
      */
      vote.poll = _vote.poll;
      callback(null, vote.poll, vote);
    })
    .catch(err => { callback(err) });
}

// Get poll owner information
function getOwnerFromPoll(poll, vote, res, callback) {
  Poll.findById(poll._id)
    .populate('owner').exec()
    .then(handleEntityNotFound(res))
    .then(_poll => {
      /* 
      * Add the poll owner information to the passed in vote
      * object, and we're done.
      */
      vote.poll.owner = _poll.owner;
      callback(null, vote); 
    })
    .catch(err => { callback(err) }); 
}

exports.getVotes = function(req, res) {
  var userId = req.params.id;

  return User.findById(userId)
    .populate('votes').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

exports.myPolls = function(req, res) {
  var userId = req.user._id;

  return User.findById(userId)
    .populate('polls').exec()
    .then(handleEntityNotFound(res))
    .then(user => {
      res.status(200).send({ msg: 'Successfully retrieved polls.', polls: user.polls }); 
    })
    .catch(err => { res.status(500).send({ msg: 'Error retrieving polls.', err: err }); });
};

exports.getPolls = function(req, res) {
  return User.findById(req.params.id)
    .populate('polls').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

exports.updateUser = function(req, res) {
  return User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

exports.showUser = function(req, res) {
  return User.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
};
