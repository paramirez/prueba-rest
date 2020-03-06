import appRoot from 'app-root-path';

export const ENV = {
	HTTP_PORT: process.env.HTTP_PORT || '5000',
	DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || 'db/database.json',
	AUTH_BASIC_USERNAME: process.env.AUTH_BASIC_USERNAME || 'admin',
	AUTH_BASIC_PASSWORD: process.env.AUTH_BASIC_PASSWORD || 'admin'
};

const LOG_FILE_PATH = `${appRoot}/logs/app.log`;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;

export const LOGGER_OPTIONS = {
	format: 'YYYY-MM-DD HH:mm:ss',
	file: {
		level: 'info',
		filename: LOG_FILE_PATH,
		handleExceptions: false,
		json: true,
		maxsize: MAX_FILE_SIZE,
		maxFiles: MAX_FILES,
		colorize: false
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: true
	}
};

export const MORGAN_PATH = 'tiny';
