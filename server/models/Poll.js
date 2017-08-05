'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./User');
var Vote = require('./Vote');

var optionSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	votes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Vote'
		}
	]
});

var pollSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	options: [optionSchema],
	owner: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	}
}, {
	timestamps: true
});

var Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
