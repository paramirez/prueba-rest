import 'reflect-metadata';
import { RequestHandlerType } from 'restify';

export enum RequestMethod {
	POST = 'post',
	GET = 'get',
	PUT = 'put',
	DELETE = 'del',
	PATCH = 'patch'
}

export interface RouteDefinition {
	path: string;
	requestMethod: RequestMethod;
	methodName: string;
	middlewares: RequestHandlerType[];
}

function httpMethod(
	requestMethod: RequestMethod,
	path: string,
	middlewares?: RequestHandlerType[]
) {
	return (target, propertyKey: string): void => {
		if (!Reflect.hasMetadata('routes', target.constructor)) {
			Reflect.defineMetadata('routes', [], target.constructor);
		}
		const routes = Reflect.getMetadata(
			'routes',
			target.constructor
		) as RouteDefinition[];
		routes.push({
			requestMethod,
			path,
			middlewares:
				Array.isArray(middlewares) && middlewares.length ? middlewares : [],
			methodName: propertyKey
		});
		Reflect.defineMetadata('routes', routes, target.constructor);
	};
}

/**
 * Crea un prefijo a un conjunto de rutas, y le aplica a todas sus rutas hija un metadato con un conjunto de middlewares
 *
 * @param prefix
 * @param middlewares
 */
export function Controller(prefix: string, middlewares?: RequestHandlerType[]) {
	return (target: any) => {
		Reflect.defineMetadata('prefix', prefix, target);

		if (!Reflect.hasMetadata('routes', target)) {
			Reflect.defineMetadata('routes', [], target);
		}

		if (!Reflect.hasMetadata('middlewares', target)) {
			if (Array.isArray(middlewares) && middlewares.length)
				Reflect.defineMetadata('middlewares', middlewares, target);
			else Reflect.defineMetadata('middlewares', [], target);
		}
	};
}

// Decoradores de método, especifica un método http

export function Get(definition: string, middlewares?: RequestHandlerType[]) {
	return httpMethod(RequestMethod.GET, definition, middlewares);
}

export function Post(definition: string, middlewares?: RequestHandlerType[]) {
	return httpMethod(RequestMethod.POST, definition, middlewares);
}

export function Put(definition: string, middlewares?: RequestHandlerType[]) {
	return httpMethod(RequestMethod.PUT, definition, middlewares);
}

export function Delete(definition: string, middlewares?: RequestHandlerType[]) {
	return httpMethod(RequestMethod.DELETE, definition, middlewares);
}

export function Patch(definition: string, middlewares?: RequestHandlerType[]) {
	return httpMethod(RequestMethod.PATCH, definition, middlewares);
}
