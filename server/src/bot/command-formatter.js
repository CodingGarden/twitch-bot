const Mustache = require('mustache');
const countdown = require('countdown');
const twitchAPI = require('../lib/twitch-api');

const cachedTemplates = {};

const resolvers = {
	twitch: {
		async uptime(context) {
			const { channelId } = context;
			const stream = await twitchAPI.getStream(channelId);
			if (stream) {
				return countdown(new Date(stream.started_at));
			} else {
				return 'offline';
			}
		},
		async viewers(context) {
			const { channelId } = context;
			const stream = await twitchAPI.getStream(channelId);
			if (stream) {
				return stream.viewer_count;
			} else {
				return 'offline';
			}
		}
	},
	user: {
		name() {
			// TODO: Get display name
		},
		status() {
			// TODO: Get stream status
		},
		game() {
			// TODO: Get stream game/directory
		}
	}
};

function getValue(name, context) {
	const [ group, prop ] = name.split('.');
	if(group in resolvers && prop in resolvers[group]) {
		try {
			return resolvers[group][prop](context);
		} catch (error) {
			console.error('Error resolving', name, error);
			return 'ERROR';
		}
	}
}

// const vm = require('vm');
// TODO: compile template in sandbox
async function formatCommand(msg, context) {
	const variables = {};
	const ast = cachedTemplates[msg] || Mustache.parse(msg);
	cachedTemplates[msg] = ast;
	await Promise.all(
		ast
			.map(async ([type, name]) => {
				if (type === 'name') {
					const [ group, prop ] = name.split('.');
					const value = await getValue(name, context);
					if (value !== undefined) {
						variables[group] = variables[group] || {};
						variables[group][prop] = value.toString();
					}
				}
			})
	);
	context.args.forEach((n, i) => variables[i] = n);
	variables['*'] = context.args.join(' ');
	console.log({ msg, variables });
	return Mustache.render(msg, variables);
}

module.exports = formatCommand;