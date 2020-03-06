import { Request, Response, Next } from 'restify';
import { AuthMiddleware } from '../middleware/Auth';
import { Controller, Get } from '../decorators/Controller';
import { TodoService } from '../services/TodoService';

@Controller('/todo', [AuthMiddleware])
export default class TodoController {
	private service: TodoService;

	constructor() {
		this.service = new TodoService();
	}

	@Get('/')
	async traerTareasCompletas(req: Request, res: Response, next: Next) {
		this.service
			.consultarTareasCompletas()
			.then(serviceResponse => res.send(serviceResponse.data))
			.catch(err => next(err));
	}
}
