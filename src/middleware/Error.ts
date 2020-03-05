import { Response, Request, Route } from 'restify';
import { LOGGER } from '@utils';

export function ErrorMiddleware(req, res, err, next) {
	LOGGER.error('Ocurrio un error ' + err.stack);
	return next();
}
