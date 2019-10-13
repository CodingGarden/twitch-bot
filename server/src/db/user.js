const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
	twitchId: {
		type: String,
		unique: true,
	},
	refresh_token: {
		type: String,
		required: true,
	}
}, {
	versionKey: false
});

/**
 * @typedef UserModel
 * @prop {string} twitchId
 * @prop {string} refresh_token
 */

/** @type {UserModel | import('mongoose').Model} */
const userModel = model('user', UserSchema);
module.exports = userModel;
