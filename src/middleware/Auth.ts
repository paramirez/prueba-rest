import { Request, Next, Response } from 'restify';
import { UnauthorizedError } from 'restify-errors';
import { ENV } from '../config';
import { LOGGER } from '../utils';

export function AuthMiddleware(req: Request, res: Response, next: Next) {
	const authorizationHeder = req.header('Authorization');
	if (authorizationHeder && authorizationHeder.includes('Basic ')) {
		const basicBase64 = authorizationHeder.split('Basic ')[1];
		const buff = Buffer.from(basicBase64, 'base64');
		const credenciales = buff.toString('ascii');
		const [usuario, password] = credenciales.split(':');
		if (
			usuario === ENV.AUTH_BASIC_USERNAME &&
			password === ENV.AUTH_BASIC_PASSWORD
		)
			return next();
	}
	LOGGER.info(`Intento fallido de autorization`);
	next(
		new UnauthorizedError(
			'Requiere de autorización básica en base64 de usuario y contraseña'
		)
	);
}
