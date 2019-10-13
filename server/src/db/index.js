const mongoose = require('mongoose');

const config = require('../config');
require('./bot');

mongoose.connect(`mongodb://${config.MONGO_HOST}/`, {
	user: config.MONGO_USER,
	pass: config.MONGO_PASS,
	dbName: config.MONGO_DBNAME,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});
const { connection: db } = mongoose;

db.on('connected', () => {
	console.log('Database connected');
});

db.on('disconnected', () => {
	console.log('Database disconnected');
});

db.on('error', err => {
	console.error(err);
});

module.exports = db;