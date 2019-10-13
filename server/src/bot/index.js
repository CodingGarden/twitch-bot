const tmi = require('tmi.js');

const botModel = require('../db/bot');
const channelModel = require('../db/channel');
const twitchAPI = require('../lib/twitch-api');
const { sleep } = require('../lib/utils');

/** @type {import('tmi.js').Client} */
let client;

async function getClient(token) {
	if(client) {
		return client;
	}
	
	try {
		const bot = await botModel.findOne({});

		if (!token) {
			({ access_token: token } = await twitchAPI.getAccessToken(bot.refresh_token));
		}
		const botUser = await twitchAPI.getUser({ token });

		// eslint-disable-next-line
		client = new tmi.Client({
			connection: {
				secure: true,
				reconnect: true
			},
			identity: {
				username: botUser.login,
				password: token
			},
			options: { debug: true }
		});

		client.on('message', messageHandler);

		await client.connect();
	} catch(error) {
		console.error('Error connecting to twitch...', error);
	}

	return client;
}

function getToken() {
	return client.getOptions().identity.password;
}

async function init() {
	try {
		await getClient();
		const dbChannels = await channelModel.find({ enabled: true });
		const id = dbChannels.map(c => c.twitchId);
		await joinChannels(id);
	} catch (error) {
		console.error('Error connecting to twitch...', error);
	}
}

/**
 * @param {string[]} id
 */
async function joinChannels(id) {
	await getClient();
	const channels = await twitchAPI.getUsers({
		token: getToken(),
		id,
	});
	for (const channel of channels) {
		await Promise.all([
			client.join(channel.login),
			sleep(350)
		]);
	}
}

/**
 * @param {string[]} id
 */
async function partChannels(id) {
	await getClient();
	const channels = await twitchAPI.getUsers({
		token: getToken(),
		id,
	});
	for (const channel of channels) {
		await Promise.all([
			client.part(channel.login),
			sleep(350)
		]);
	}
}

/**
 * @param {string} channel
 * @param {import('tmi.js').ChatUserstate} tags
 * @param {string} message
 * @param {boolean} self
 */
async function messageHandler(channel, tags, message, self) {
	if (self || tags['message-type'] === 'whisper') {
		return;
	}
	if (message.startsWith('!')) {
		const args = message.slice(1).split(' ');
		const command = args.shift().toLowerCase();
		if (command === 'echo') {
			await client.say(channel, `@${tags.username}, ${args.join(' ')}`);
		}
	}
}

module.exports = {
	init,
	joinChannels,
	partChannels
};