'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./User');
var Poll = require('./Poll');

var voteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},

	poll: {
		type: mongoose.Schema.ObjectId,
		ref: 'Poll'
	},

	choice: String
}, {
	timestamps: true
});

var Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;