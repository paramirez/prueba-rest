import 'reflect-metadata';
import { RequestHandlerType, Request, Response, Next, Server } from 'restify';
import { RouteDefinition } from '@decorator/Controller';
import { ErrorMiddleware } from '@middleware/Error';

/**
 * @author Pablo Ramírez
 *
 * Método que crea un express.Router con una lista de recursos http
 * haciendo uso de la metadata de cada uno de los controladores
 * que implementan los decoradores @see {Controller}
 *
 * @param router Router
 * @param Controllers Lista de controladores que atenderan a las rutas
 * @returns {Router}
 */
export function GetRouterByControllerList(server: Server, Controllers: any[]) {
	const generalRoutes = [];

	Controllers.forEach(controller => {
		const instance = new controller();
		const prefix = Reflect.getMetadata('prefix', controller);
		const routes: Array<RouteDefinition> = Reflect.getMetadata(
			'routes',
			controller
		);
		const middlewares: Array<RequestHandlerType> = Reflect.getMetadata(
			'middlewares',
			controller
		);
		routes.forEach(route => {
			if (
				(Array.isArray(route.middlewares) && route.middlewares.length) ||
				middlewares.length
			) {
				const applyMiddlewares = []
					.concat(middlewares)
					.concat(route.middlewares ? route.middlewares : []);
				server[route.requestMethod.toLowerCase()](
					{ name: route.path, path: prefix + route.path },
					...applyMiddlewares,
					(req: Request, res: Response, next: Next) => {
						instance[route.methodName](req, res, next);
					}
				);
			} else {
				server[route.requestMethod.toLowerCase()](
					{ name: route.path, path: prefix + route.path },
					(req: Request, res: Response, next: Next) => {
						instance[route.methodName](req, res, next);
					}
				);
			}
		});
	});
}
