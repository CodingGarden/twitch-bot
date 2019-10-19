const { model, Schema } = require('mongoose');

const CommandSchema = new Schema({
	channelId: { type: String, required: true },
	name: { type: String, required: true },
	aliases: [{ type: String }],
	replyText: { type: String, required: true },
	requiredRole: { type: String, default: 'viewer' },
	enabled: { type: Boolean, default: true },
}, {
	versionKey: false
});

const commandModel = model('command', CommandSchema);
module.exports = commandModel;
