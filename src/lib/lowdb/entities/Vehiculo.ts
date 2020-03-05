import Database from '../Database';

export const VehiculoEntity = () => Database.getConnection().get('Vehiculos');
