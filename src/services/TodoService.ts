import { Service } from './Service';
import Axios from 'axios';
import { LOGGER } from '../utils';

export class TodoService extends Service {
	load() {
		LOGGER.debug('Iniciando servicio TodoService');
	}

	consultarTareasCompletas() {
		return Axios.get(
			`https://jsonplaceholder.typicode.com/users/1/todos?completed=true`
		);
	}
}
