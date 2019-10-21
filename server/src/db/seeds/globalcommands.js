module.exports = [
	{
		name: 'uptime',
		aliases: [],
		replyText: 'Channel has been live for: {{twitch.uptime}}',
		requiredRole: 'viewer'
	}, {
		name: 'following',
		aliases: [],
		requiredRole: 'viewer'
	}, {
		name: 'settitle',
		aliases: [],
		requiredRole: 'manager'
	}, {
		name: 'setgame',
		aliases: [ 'setcategory', 'setdirectory', 'setplaying' ],
		requiredRole: 'manager'
	}
];