import { config } from 'dotenv';
import { Server, createServer, plugins, Router } from 'restify';
import { ENV } from '@config';
import { LOGGER } from '@utils';
import { GetRouterByControllerList } from '@route/index';
import controllers from '@controllers/index';
import Database from './lib/lowdb/Database';
import { ErrorMiddleware } from '@middleware/Error';

function InitializeMiddlewares(server: Server) {
	server.use(plugins.pre.userAgentConnection());
	server.use(plugins.bodyParser());
	server.use(plugins.queryParser());
}

export let AppRouter: Router;

async function Inizalize() {
	config();

	const { HTTP_PORT } = ENV;
	await Database.createConnection();
	const server = createServer();
	AppRouter = server.router;

	InitializeMiddlewares(server);
	GetRouterByControllerList(server, controllers);
	server.on('InternalServer', ErrorMiddleware);

	server.listen(HTTP_PORT, () =>
		LOGGER.info(`${server.name} Servidor corriendo en ${server.url}`)
	);
}

(async () => {
	await Inizalize();
})();
