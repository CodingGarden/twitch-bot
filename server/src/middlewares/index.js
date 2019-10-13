const jwt = require('../lib/jwt');

async function decodeAuthHeader(req, res, next) {
	const authHeader = req.get('Authorization');
	req.user = null;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		if (token) {
			try {
				const user = await jwt.verify(token);
				// eslint-disable-next-line
				req.user = user;
			} catch (error) {
				console.error('Error validating token.', token);
			}
		}
	}
	next();
}

module.exports = {
	decodeAuthHeader
};