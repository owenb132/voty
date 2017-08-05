'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./User');
var Poll = require('./Poll');

var voteSchema = new mongoose.Schema({
	choice: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},

	ip: {
		type: String
	},

	poll: {
		type: mongoose.Schema.ObjectId,
		ref: 'Poll',
		required: true
	}
}, {
	timestamps: true
});

var Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;