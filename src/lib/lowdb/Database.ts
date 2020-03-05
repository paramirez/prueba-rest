import FileAsync from 'lowdb/adapters/FileAsync';
import Lowdb from 'lowdb';
import { LOGGER } from '@utils';
import { ENV } from '@config';
import { VehiculoModel } from '@models/Vehiculo';

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

	//Singleton connection
	static async createConnection(): Promise<Connection> {
		const db = await new Promise(
			(resolve: (db: Connection) => void, reject) => {
				if (!Database.Connection) {
					new Database(ENV.DB_CONNECTION_STRING, (err, db) => {
						if (err) {
							LOGGER.error(err);
							return reject(err);
						}
						LOGGER.info('Conexión a base de datos exitosa');
						Database.Connection = db;
						resolve(db);
					});
				} else resolve(Database.Connection);
			}
		);
		return db;
	}

	static getConnection(): Connection {
		return Database.Connection;
	}
}
