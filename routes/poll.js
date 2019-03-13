const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

var Vote = require('../models/vote');

const Pusher = require('pusher');

var pusher = new Pusher({
  appId: '733822',
  key: '9b148cf11b5ae8cc3549',
  secret: 'f43af7917753ee9401b6',
  cluster: 'ap2',
  encrypted: true
});

router.get('/', (req,res) => {
	Vote.find().then(votes => res.json({ success: true,
		votes: votes }));
});

router.post('/', (req,res) => {
	const newVote = {
		dslr: req.body.dslr,
		points: 1
	}
	new Vote(newVote).save().then(vote => {
		pusher.trigger('dslr-poll', 'dslr-vote', {
  			points: parseInt(vote.points),
  			dslr: req.body.dslr
		});
	})

	return res.json({success: true, message: 'Thanks for voting'});
});

module.exports = router;