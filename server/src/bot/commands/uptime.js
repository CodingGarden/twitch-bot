const countdown = require('countdown');
const twitchAPI = require('../../lib/twitch-api');

module.exports = async function({ channel, channelId, reply }) {
	const stream = await twitchAPI.getStream(channelId);
	channel = channel.slice(1);
	if(stream) {
		const uptime = countdown(new Date(stream.started_at));
		reply(`${channel} has been live for: ${uptime}`);
	}
	else {
		reply(`${channel} is currently offline`);
	}
};