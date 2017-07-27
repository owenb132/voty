'use strict';

var _ = require('lodash');
var Poll = require('../models/Poll');

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

exports.show = function(req, res) {
	return Poll.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
};

exports.create = function(req, res) {
	return Poll.create(req.body)
		.then(respondWithResult(res, 201))
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
	return Poll.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}

