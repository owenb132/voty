'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./User');
var Vote = require('./Vote');

var optionSchema = new mongoose.Schema({
	text: String,
	votes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Vote'
		}
	]
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
