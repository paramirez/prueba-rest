import { config } from 'dotenv';
import { Server, createServer, plugins, Router } from 'restify';
import Database from './lib/lowdb/Database';
import { ErrorMiddleware } from './middleware/Error';
import { ENV } from './config';
import controllers from './controllers';
import { GetRouterByControllerList } from './route';
import { LOGGER } from './utils';

function InitializeMiddlewares(server: Server) {
	server.use(plugins.pre.userAgentConnection());
	server.use(plugins.bodyParser());
	server.use(plugins.queryParser());
	server.use(plugins.gzipResponse());
	server.use(function crossOrigin(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		return next();
	});
}

export let AppRouter: Router;

export async function Initialize() {
	config();

	const { HTTP_PORT } = ENV;
	await Database.createConnection();
	const server = createServer({
		ignoreTrailingSlash: true
	});
	AppRouter = server.router;

	InitializeMiddlewares(server);
	GetRouterByControllerList(server, controllers);
	server.on('InternalServer', ErrorMiddleware);

	server.listen(HTTP_PORT, () =>
		LOGGER.info(`${server.name} Servidor corriendo en ${server.url}`)
	);
	return server;
}
