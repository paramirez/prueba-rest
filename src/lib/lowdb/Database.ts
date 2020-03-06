import FileAsync from 'lowdb/adapters/FileAsync';
import Lowdb from 'lowdb';
import { VehiculoModel } from '../../models/Vehiculo';
import { ENV } from '../../config';
import { LOGGER } from '../../utils';

export interface Schema {
	Vehiculos: VehiculoModel[];
}

export type Connection = Lowdb.LowdbAsync<Schema>;

export default class Database {
	private static Connection: Connection;

	private constructor(
		connectionString: string,
		cb: (err, db?: Connection) => void
	) {
		const adapter = new FileAsync(connectionString);
		Lowdb(adapter)
			.then(db => {
				cb(null, db);
				db.defaults({
					Vehiculos: []
				}).write();
			})
			.catch(err => {
				cb(err);
			});
	}

	// Singleton connection
	static async createConnection(): Promise<Connection> {
		const db = await new Promise(
			(resolve: (db: Connection) => void, reject) => {
				if (!Database.Connection) {
					const database = new Database(
						ENV.DB_CONNECTION_STRING,
						(err, newDB?: Connection) => {
							if (err) {
								LOGGER.error(err);
								return reject(err);
							}
							LOGGER.info('Conexión a base de datos exitosa');
							Database.Connection = newDB;
							resolve(newDB);
						}
					);
				} else resolve(Database.Connection);
			}
		);
		return db;
	}

	static getConnection(): Connection {
		return Database.Connection;
	}
}
