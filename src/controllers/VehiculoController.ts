import { Request, Response, Next } from 'restify';
import { BadRequestError } from 'restify-errors';
import { AuthMiddleware } from '../middleware/Auth';
import { Controller, Get, Post, Put, Delete } from '../decorators/Controller';
import {
	VehiculoService,
	VehiculoErrorTypes
} from '../services/VehiculoService';
import { VehiculoModel } from '../models/Vehiculo';

@Controller('/vehiculo', [AuthMiddleware])
export default class VehiculoController {
	private vehiculoService: VehiculoService;

	constructor() {
		this.vehiculoService = new VehiculoService();
		this.vehiculoService.load();
	}

	@Get('/:placa')
	async vehiculoPorPlaca(req: Request, res: Response, next: Next) {
		try {
			const { placa } = req.params as { placa: string };
			const resultado = this.vehiculoService.ConsultarVehiculoPorPlaca(placa);

			if (typeof resultado === 'string') {
				if (resultado === VehiculoErrorTypes.VEHICULO_INHABILTADO)
					throw new BadRequestError(resultado);
				else return res.send(204);
			}

			return res.json({ vehiculo: resultado });
		} catch (error) {
			next(error);
		}
	}

	@Get('/')
	async vehiculos(req: Request, res: Response, next: Next) {
		try {
			let { incluirBorrados } = req.query as { incluirBorrados: number };

			if (incluirBorrados && typeof incluirBorrados === 'string') {
				try {
					incluirBorrados = parseInt(incluirBorrados, 10);
				} catch (error) {
					throw new BadRequestError('deleted debe ser un valor entre 0 y 1');
				}
			}

			const vehiculos = await this.vehiculoService.TraerTodosLosVehiculos(
				incluirBorrados
			);
			return res.json({ vehiculos });
		} catch (error) {
			next(error);
		}
	}

	@Post('/')
	async crearVehiculo(req: Request, res: Response, next: Next) {
		try {
			const vehiculo = req.body as VehiculoModel;

			if (!vehiculo || !vehiculo.placa || !vehiculo.modelo || !vehiculo.marca)
				throw new BadRequestError('placa, modelo y marca son requeridos');

			const resultado = await this.vehiculoService.CrearVehiculo(vehiculo);

			if (typeof resultado === 'string') throw new BadRequestError(resultado);

			res.send(201);
		} catch (error) {
			next(error);
		}
	}

	@Put('/:placa')
	async actualizarVehiculo(req: Request, res: Response, next: Next) {
		try {
			const { placa } = req.params as { placa: string };
			const vehiculo = req.body as VehiculoModel;

			if (!vehiculo && !vehiculo.placa && !vehiculo.modelo && !vehiculo.marca)
				throw new BadRequestError(
					'Debe enviar un de los sigueintes campos para su actualización placa, modelo y marca'
				);

			const resultado = await this.vehiculoService.ActualizarVehiculo(
				placa,
				vehiculo
			);

			if (typeof resultado === 'string') throw new BadRequestError(resultado);
			res.send(200);
		} catch (error) {
			next(error);
		}
	}

	@Delete('/:placa')
	async eliminarVehiculo(req: Request, res: Response, next: Next) {
		try {
			const { placa } = req.params as { placa: string };
			const resultado = await this.vehiculoService.DeshabilitarVehiculo(placa);

			if (typeof resultado === 'string') throw new BadRequestError(resultado);
			res.send(200);
		} catch (error) {
			next(error);
		}
	}
}
