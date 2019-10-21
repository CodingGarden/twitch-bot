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
 * @typedef TwitchStream
 * @prop {string} id The ID of the stream.
 * @prop {string} user_id The Twitch API user ID.
 * @prop {string} user_name The Twitch API display name.
 * @prop {string} game_id The ID of the game.
 * @prop {"live" | ""} type Stream type.
 * @prop {number} viewer_count
 * @prop {string} started_at Date string.
 * @prop {string} language
 * @prop {string} thumbnail_url
 * @see https://dev.twitch.tv/docs/api/reference#get-streams
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

// TODO: cache results for x amount of time, don't call same API twice simultaneously
/**
 * @param {string} user_id
 * @return {TwitchStream}
 * @see https://dev.twitch.tv/docs/api/reference#get-streams
 */
async function getStream(user_id) {
	const qs = new URLSearchParams({
		user_id
	});
	const { data: { data } } = await helix.get(`/streams?${qs}`, {
		headers: {
			'Client-ID': config.TWITCH_CLIENT_ID
		}
	});
	return data[0] || null;
}

module.exports = {
	authAPI,
	getUser,
	getUsers,
	getAccessToken,
	getStream
};