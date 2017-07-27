'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./User');

var voteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
});

var optionSchema = new mongoose.Schema({
	text: String,
	votes: [voteSchema]
});

var pollSchema = new mongoose.Schema({
	text: String,
	options: [optionSchema],
	owner: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
});

var Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
