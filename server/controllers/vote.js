'use strict';

var _ = require('lodash');
var async = require('async');
var Vote = require('../models/Vote');
var Poll = require('../models/Poll');
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
	return Vote.find().exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
};

exports.show = function(req, res) {
	return Vote.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
};

exports.getUser = function(req, res) {
  return Vote.findById(req.params.id)
    .populate('user').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

exports.create = function(req, res) {
  var authenticated = req.body.authenticated;
  var user = req.user;
  var vote = req.body;
  var pollId = vote.poll;
  var choice = vote.choice;

  if (authenticated) {
    vote.user = user._id;
  } else {
    vote.ip = req.ip;
  }

  // Save the vote to db
  Vote.create(vote)
    .then(result => {

      async.parallel([

        // Get poll information in order to update its votes list
        callback => {
          Vote.findOne(result)
            .populate('poll').exec()
            .then(handleEntityNotFound(res))
            .then(_vote => {
              var poll = _vote.poll;

              // Add the vote to the corect option
              var optionIndex = poll.options.findIndex(opt => opt.text === choice);
              poll.options[optionIndex].votes.push(result._id);

              // Update poll and save to db
              addVoteToPoll(poll._id, poll.options, res, callback);
            })
            .catch(handleError(res));
        },

        // Update user and save to db
        callback => {
          if (authenticated) {
            user.votes.push(result._id);
            addVoteToUser(user._id, user.votes, res, callback);
          } else {
            callback();
          }
        }
      ],
        // All operations complete
        (err, results) => {
          if (err) {
            res.status(500).send({ msg: 'Error logging vote.', err: err});
          }
          if (results) {
            res.status(200).send({ msg: 'Voted logged successfully.', poll: results[0], user: results[1] });
          }
        });
    })
    .catch(handleError(res));
};

exports.patch = function(req, res) {
  return Vote.findOneAndUpdate({
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
	return Vote.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}

exports.getPoll = function(req, res) {
  return Vote.findById(req.params.id)
    .populate('poll').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

exports.findByIp = function(req, res) {
  return Vote.find({ ip: req.ip }).exec()
    .then(handleEntityNotFound(res))
    .then(votes => { res.status(200).send({ msg: 'Successfully retrieved your votes.', votes: votes }); })
    .catch(err => { res.status(500).send({ msg: 'Error retrieving your votes.', err: err }); });
};

function addVoteToUser(userId, updatedVotes, res, callback) {
  return User.findByIdAndUpdate(userId, { votes: updatedVotes}, { new: true }).exec()
    .then(handleEntityNotFound(res))
    .then(user => { callback(null, user) })
    .catch(err => { callback(err) });
}

function addVoteToPoll(pollId, updatedOptions, res, callback) {
  return Poll.findByIdAndUpdate(pollId, { options: updatedOptions }, { new: true }).exec()
    .then(handleEntityNotFound(res))
    .then(poll => { callback(null, poll) })
    .catch(err => { callback(err ) });
}

