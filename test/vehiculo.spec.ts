import Axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import { Initialize } from '../src/server';
import { ENV } from '../src/config/index';
import { Server } from 'restify';
import { LOGGER } from '../src/utils/Logger';
import { VehiculoModel } from '../src/models/Vehiculo';
import { VehiculoEntity } from '../src/lib/lowdb/entities/Vehiculo';

let server: Server;
let vehiculoEntity: ReturnType<typeof VehiculoEntity>;
let baseUrl: string;
let axiosConfig;
const placa = 'ZZZ-99Z';
const vehiculo = {
	marca: 'MAZDA',
	modelo: 2018,
	placa,
	createdAt: new Date()
};

beforeAll(async done => {
	LOGGER.pause();
	server = await Initialize();
	baseUrl = `http://localhost:${process.env.HTTP_PORT}`;
	vehiculoEntity = VehiculoEntity();
	axiosConfig = {
		auth: {
			username: ENV.AUTH_BASIC_USERNAME,
			password: ENV.AUTH_BASIC_PASSWORD
		},
		adapter
	};
	await vehiculoEntity.push(<VehiculoModel>vehiculo).write();
	done();
});

describe('Vehiculos', () => {
	it('Consultar Vehículos', async done => {
		try {
			const response = await Axios(`${baseUrl}/vehiculo`, { ...axiosConfig });
			const data = response.data;
			if (data && Array.isArray(data.vehiculos)) done();
			else done(`No responde bien el servicio ${data}`);
		} catch (error) {
			done(error);
		}
	});

	it(`Consultar Vehículo por placa: ${placa}`, async done => {
		try {
			const response = await Axios(`${baseUrl}/vehiculo/ZZZ-99Z`, axiosConfig);
			const data = response.data;
			if (data && data.vehiculo && data.vehiculo.placa === placa) done();
			else done(`No responde bien el servicio ${data}`);
		} catch (error) {
			done(error);
		}
	});

	describe('Creación', () => {
		it(`Crear un vehículo existente con # placa: ${placa}: status code 400`, async done => {
			try {
				await Axios.post(`${baseUrl}/vehiculo/`, vehiculo, axiosConfig);
				done(`El servicio respondio con algo diferente a 400`);
			} catch (error) {
				if (
					error &&
					error.response &&
					error.response.status &&
					error.response.status === 400
				)
					return done();
				done(error);
			}
		});

		it(`Crear un vehículo existente con placa ZZZ-000: status code 201`, async done => {
			try {
				const response = await Axios.post(
					`${baseUrl}/vehiculo/`,
					{ ...vehiculo, placa: 'ZZZ-000' },
					axiosConfig
				);
				if (response.status === 201) done();
				else done(`El servicio respondio con algo diferente a 201`);
			} catch (error) {
				console.log(error.responde);
				done(error);
			}
		});

		afterAll(async done => {
			await vehiculoEntity.remove(<VehiculoModel>{ placa: 'ZZZ-000' }).write();
		});
	});
});

afterAll(async done => {
	await vehiculoEntity.remove(<VehiculoModel>{ placa }).write();
	server.close(done);
});
