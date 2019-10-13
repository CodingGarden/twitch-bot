const axios = require('axios');

const config = require('../config');

const authBaseUrl = 'https://id.twitch.tv/oauth2';
const authAPI = axios.create({
	baseURL: authBaseUrl,
});

const helixBaseUrl = 'https://api.twitch.tv/helix';
const helix = axios.create({
	baseURL: helixBaseUrl,
});

/**
 * @typedef TwitchAPIUser
 * @prop {string} id The Twitch API user ID.
 * @prop {string} login The Twitch API user login name.
 */

/**
 * @param {any} options
 * @param {string} options.token The OAuth token for the expected user.
 * @return {TwitchAPIUser}
 */
async function getUser({ token } = {}) {
	const { data: { data } } = await helix.get('/users', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data[0] || null;
}

/**
 * @param {any} options
 * @param {string} id A list of IDs to look up.
 * @param {string} options.token The OAuth token for the bot user.
 * @return {TwitchAPIUser[]}
 */
async function getUsers({ id = [], token }) {
	if (!id.length) return [];
	const qs = new URLSearchParams();
	// TODO: handle more than 100 ids
	for(const n of id) {
		qs.append('id', n);
	}
	const { data: { data } } = await helix.get(`/users?${qs}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data;
}

async function getAccessToken(refresh_token) {
	const qs = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token,
		client_id: config.TWITCH_CLIENT_ID,
		client_secret: config.TWITCH_CLIENT_SECRET
	});
	const { data } = await authAPI.post(`/token?${qs}`);
	return data;
}

module.exports = {
	authAPI,
	getUser,
	getUsers,
	getAccessToken,
};