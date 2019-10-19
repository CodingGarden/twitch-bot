const express = require('express');

const channelModel = require('../db/channel');
const commandModel = require('../db/command');
const { joinChannels, partChannels } = require('../bot');

const router = express.Router();

const ensureUserAccess = (req, res, next) => {
	const { twitchId } = req.params;
	// TODO: check manager collection too, instead of just id
	if (twitchId !== req.user.twitchId) {
		const error = new Error('Not Allowed!');
		return next(error);
	}
	next();
};

router.get('/:twitchId', ensureUserAccess, async (req, res, next) => {
	const { twitchId } = req.params;
	try {
		const channel = await channelModel.findOne({ twitchId });
		if(!channel) {
			return next();
		}
		res.json(channel);
	} catch (error) {
		next(error);
	}
});

router.patch('/:twitchId', ensureUserAccess, async (req, res, next) => {
	const { twitchId } = req.params;
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

router.get('/:twitchId/commands', ensureUserAccess, async (req, res, next) => {
	const { twitchId } = req.params;
	try {
		const commands = await commandModel.find({ channelId: twitchId });
		res.json(commands);
	} catch (error) {
		next(error);
	}
});

// create new command
router.post('/:twitchId/commands', ensureUserAccess, async (req, res, next) => {
	const { twitchId } = req.params;
	const { name, aliases, replyText, requiredRole } = req.body;
	try {
		const existingCommand = await commandModel.findOne({
			channelId: twitchId, name
		});
		if(existingCommand) {
			throw new Error('Command already exists');
		}
		const command = await commandModel.create({
			channelId: twitchId, name, aliases, replyText, requiredRole
		});
		res.json(command);
	} catch (error) {
		next(error);		
	}
});

router.patch('/:twitchId/commands/:commandId', ensureUserAccess, async (req, res, next) => {
	const { twitchId, commandId } = req.params;
	const { name, aliases, replyText, requiredRole } = req.body;
	try {
		const updated = await commandModel.findOneAndUpdate(
			{ _id: commandId, channelId: twitchId },
			Object.fromEntries(
				Object.entries({ name, aliases, replyText, requiredRole })
					.filter(n => n[1] !== undefined)
			),
			{ new: true }
		);
		if(!updated) {
			return next();
		}
		res.json(updated);
	} catch (error) {
		next(error);
	}
});

router.delete('/:twitchId/commands/:commandId', ensureUserAccess, async (req, res, next) => {
	const { twitchId, commandId } = req.params;
	try {
		const { deletedCount } = await commandModel.deleteOne({
			_id: commandId, channelId: twitchId
		});
		console.log({ deletedCount });
		if(!deletedCount) {
			return next();
		}
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});

module.exports = router;