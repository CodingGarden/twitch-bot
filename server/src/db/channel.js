const { model, Schema } = require('mongoose');

const ChannelSchema = new Schema({
	twitchId: {
		type: String,
		unique: true,
	},
	enabled: {
		type: Boolean,
		default: false
	}
}, {
	versionKey: false
});

/**
 * @typedef ChannelModel
 * @prop {string} twitchId
 * @prop {boolean} enabled
 */

/** @type {ChannelModel | import('mongoose').Model} */
const channelModel = model('channel', ChannelSchema);
module.exports = channelModel;