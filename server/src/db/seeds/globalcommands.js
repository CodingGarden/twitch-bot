module.exports = [
	{
		name: 'uptime',
		aliases: [],
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