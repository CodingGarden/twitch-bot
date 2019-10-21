const tmi = require('tmi.js');

const botModel = require('../db/bot');
const channelModel = require('../db/channel');
const globalCommandModel = require('../db/globalcommand');
const commandModel = require('../db/command');
const twitchAPI = require('../lib/twitch-api');
const { sleep } = require('../lib/utils');
const formatCommand = require('./command-formatter');

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
 * @param {string} channelId
 * @param {string} commandName
 * @param {string[]} args
 */
async function commandHandler(context) {
	const { reply, channelId, commandName } = context;
	// TODO: search through command aliases as well
	const [ channelCommand, globalCommand ] = await Promise.all([
		commandModel.findOne({ channelId, name: commandName }),
		globalCommandModel.findOne({ name: commandName })
	]);
	const command = channelCommand || globalCommand;
	if (!command) {
		return;
	}
	if(command.replyText) {
		reply(command.replyText);
	} else {
		// TODO: check required command permission
		const commandFn = require(`./commands/${command.name}`);
		commandFn(context);
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
	// TODO: handle other prefixes based on channel settings
	if (message.startsWith('!')) {
		const args = message.slice(1).split(' ');
		const commandName = args.shift().toLowerCase();
		const channelId = tags['room-id'];
		const context = { channel, channelId, commandName, args };
		const reply = async msg => {
			try {
				msg = await formatCommand(msg, context);
				console.log({ msg });
				if (msg.startsWith('/') || msg.startsWith('.')) {
					msg = 'Nice try! 🙃';
				}
				await client.say(channel, msg);
			} catch (error) {
				console.error('Error compiling template', error);
			}
		};
		commandHandler({ reply, ...context });
	}
}

module.exports = {
	init,
	joinChannels,
	partChannels
};