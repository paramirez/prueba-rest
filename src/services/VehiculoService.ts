import { Service } from './Service';
import { VehiculoModel } from '../models/Vehiculo';
import { VehiculoEntity } from '../lib/lowdb/entities/Vehiculo';

const ERRORS = {
	VEHICULO_EXISTE: 'El vehículo ya existe',
	VEHICULO_NO_EXISTE: 'El vehículo no existe',
	N_PLACA_INVALIDA: 'No parece ser un número de placa',
	VEHICULO_INHABILTADO: 'El vehículo se encuentra inhabilitado'
};

export const VehiculoErrorTypes = ERRORS;

export class VehiculoService extends Service {
	private entity: ReturnType<typeof VehiculoEntity>;

	load() {
		if (!this.entity) this.entity = VehiculoEntity();
	}

	private validarPlaca(placa: string) {
		return /[A-Z][A-Z][A-Z]-[0-9][0-9][0-9A-Z]/.test(placa);
	}

	async CrearVehiculo(vehiculo: VehiculoModel) {
		const vehiculoChain = this.VehiculoPorPlaca(vehiculo.placa);

		if (vehiculoChain.value() && vehiculoChain.value().deleted)
			return ERRORS.VEHICULO_EXISTE + ', ' + ERRORS.VEHICULO_INHABILTADO;
		else if (vehiculoChain.value()) return ERRORS.VEHICULO_EXISTE;

		if ('placa' in vehiculo && !this.validarPlaca(vehiculo.placa))
			return ERRORS.N_PLACA_INVALIDA;

		const nuevoVehiculo = await this.entity
			.push({
				...vehiculo,
				deleted: false,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.write();
		return nuevoVehiculo.length;
	}

	async ActualizarVehiculo(placa: string, vehiculo: VehiculoModel) {
		const vehiculoChain = this.VehiculoPorPlaca(placa);

		if (!vehiculoChain.value()) return ERRORS.VEHICULO_NO_EXISTE;
		if (vehiculoChain.value().deleted) return ERRORS.VEHICULO_INHABILTADO;
		if ('placa' in vehiculo && !this.validarPlaca(vehiculo.placa))
			return ERRORS.N_PLACA_INVALIDA;

		return await vehiculoChain
			.assign({ ...vehiculo, updatedAt: new Date() } as VehiculoModel)
			.write();
	}

	async DeshabilitarVehiculo(placa: string) {
		const vehiculoChain = this.VehiculoPorPlaca(placa);

		if (!vehiculoChain.value()) return ERRORS.VEHICULO_NO_EXISTE;
		return vehiculoChain
			.assign({ deleted: true, updatedAt: new Date() } as VehiculoModel)
			.write();
	}

	TraerTodosLosVehiculos(incluirBorrados: number = 0) {
		return this.entity
			.value()
			.filter(vehiculo => (incluirBorrados ? true : !vehiculo.deleted))
			.map(vehiculo => this.informacionPlublicaVehiculo(vehiculo));
	}

	private VehiculoPorPlaca(placa: string) {
		return this.entity.find({ placa });
	}

	ConsultarVehiculoPorPlaca(placa: string) {
		const vehiculo = this.VehiculoPorPlaca(placa).value();
		if (!vehiculo) return ERRORS.VEHICULO_NO_EXISTE;
		if (vehiculo.deleted) return ERRORS.VEHICULO_INHABILTADO;
		return this.informacionPlublicaVehiculo(vehiculo);
	}

	private informacionPlublicaVehiculo(vehiculo: VehiculoModel) {
		return {
			placa: vehiculo.placa,
			modelo: vehiculo.modelo,
			marca: vehiculo.marca
		};
	}
}
