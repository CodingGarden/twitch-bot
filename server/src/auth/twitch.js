const express = require('express');

const config = require('../config');
const twitchAPI = require('../lib/twitch-api');
const userModel = require('../db/user');
const channelModel = require('../db/channel');
const jwt = require('../lib/jwt');

const redirect_uri = `${config.TWITCH_CLIENT_REDIR_HOST}/auth/twitch/callback`;

const router = express.Router();

router.get('/', (req, res) => {
	const qs = new URLSearchParams({
		client_id: config.TWITCH_CLIENT_ID,
		redirect_uri,
		response_type: 'code',
		scope: req.query.scope
	});
	const redirectUrl = `${twitchAPI.authAPI.defaults.baseURL}/authorize?${qs}`;
	res.redirect(redirectUrl);
});

router.get('/callback', async (req, res) => {
	const { code, /* state */ } = req.query;
	const qs = new URLSearchParams({
		client_id: config.TWITCH_CLIENT_ID,
		client_secret: config.TWITCH_CLIENT_SECRET,
		code,
		grant_type: 'authorization_code',
		redirect_uri
	});
	try {		
		const {
			data: { access_token: token, refresh_token }
		} = await twitchAPI.authAPI.post(`/token?${qs}`);
		const { id: twitchId } = await twitchAPI.getUser({ token });
		const query = { twitchId };
		/** @type {import('mongoose').QueryFindOneAndUpdateOptions)} */
		const options = {
			new: true,
			upsert: true
		};
		const [ user, channel ] = await Promise.all([
			userModel.findOneAndUpdate(
				query,
				{ twitchId, refresh_token },
				options
			),
			channelModel.findOneAndUpdate(
				query,
				query,
				options
			)
		]);
		const loginToken = await jwt.sign({ twitchId });
		res.json({
			loginToken,
			user,
			channel
		});
	} catch (error) {
		res.json({
			message: error.message,
			// body: error.response ? error.response.data : error,
		});
	}
});

module.exports = router;