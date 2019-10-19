const { model, Schema } = require('mongoose');

const GlobalCommandSchema = new Schema({
	name: { type: String, required: true },
	aliases: [{ type: String }],
	requiredRole: { type: String, default: 'viewer' }
}, {
	versionKey: false
});

const globalCommandModel = model('globalCommand', GlobalCommandSchema);
module.exports = globalCommandModel;
