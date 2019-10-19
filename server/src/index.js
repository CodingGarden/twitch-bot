const express = require('express');
const cors = require('cors');
const volleyball = require('volleyball');
const helmet = require('helmet');
const path = require('path');

require('dotenv').config();

const config = require('./config');

require('./db');
const middlewares = require('./middlewares');

const bot = require('./bot');
bot.init();

const app = express();
app.use(cors());
app.use(volleyball);
app.use(helmet());
app.use(express.json());

app.use(middlewares.decodeAuthHeader);

app.use(express.static(path.join(__dirname, 'www'), { extensions: [ 'html' ] }));

app.use('/auth/twitch', require('./auth/twitch'));
app.use('/api/channel', (req, res, next) => {
	if (!req.user) {
		next(new Error('Un-authorized'));
	}
	next();
}, require('./api/channel'));

app.use((req, res, next) => {
	const error = new Error('Not Found - ' + req.originalUrl);
	res.status(404);
	next(error);
});

// eslint-disable-next-line
app.use((error, req, res, next) => {
	res.status(res.statusCode === 200 ? 500 : res.statusCode);
	res.json({
		message: error.message,
		stack: config.NODE_ENV === 'production' ? undefined : error.stack,
	});
});

const port = process.env.PORT || 8888;
const server = app.listen(
	port,
	() => console.log('http://localhost:' + server.address().port)
);
