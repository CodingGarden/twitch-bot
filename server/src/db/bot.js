const { model, Schema } = require('mongoose');

const BotSchema = new Schema({
	name: {
		type: String,
		unique: true,
	},
	refresh_token: {
		type: String,
		required: true,
	}
});

/**
 * @typedef BotModel
 * @prop {string} name
 * @prop {string} refresh_token
 */

/** @type {BotModel | import('mongoose').Model} */
const botModel = model('bot', BotSchema);
module.exports = botModel;
