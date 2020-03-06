import { createLogger, transports, format } from 'winston';
import { LOGGER_OPTIONS } from '../config';

export const LOGGER = createLogger({
	transports: [
		new transports.File(LOGGER_OPTIONS.file),
		new transports.Console(LOGGER_OPTIONS.console)
	],
	format: format.combine(
		format.timestamp({
			format: LOGGER_OPTIONS.format
		}),
		format.json(),
		format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	exitOnError: false
});
