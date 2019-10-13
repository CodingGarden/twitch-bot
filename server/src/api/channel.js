const express = require('express');

const channelModel = require('../db/channel');
const { joinChannels, partChannels } = require('../bot');

const router = express.Router();

router.patch('/:twitchId', async (req, res, next) => {
	const { twitchId } = req.params;
	// TODO: check manager collection too, instead of just id
	if (twitchId !== req.user.twitchId) {
		const error = new Error('Not Allowed!');
		return next(error);
	}
	const { enabled } = req.body;
	if(enabled === undefined || typeof enabled !== 'boolean') {
		return next(new Error('Enabled must be a boolean.'));
	}
	try {
		const channel = await channelModel.findOneAndUpdate(
			{ twitchId },
			{ enabled },
			{ new: true }
		);
		if (!channel) {
			return next();
		}
		if (enabled) {
			await joinChannels([ twitchId ]);
		} else {
			await partChannels([ twitchId ]);
		}
		return res.json(channel);
	} catch (error) {
		return next(error);	
	}
});

module.exports = router;