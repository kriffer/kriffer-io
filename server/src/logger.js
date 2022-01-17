const winston = require('winston');

module.exports = winston.createLogger({
	format: winston.format.combine(
		winston.format.label({label:'kriffer.io'}),
		winston.format.timestamp(),
		winston.format.json(),

	),
	transports: [
		new winston.transports.Console({level:'debug'}),
	],


})