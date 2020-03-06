# Prueba Rest Assist Consultores

Implementación de la prueba propuesta, servicio rest que expone un crud simple de vehículos y un servicio que consulta https://jsonplaceholder.typicode.com/todos


#### Despliegue

```sh
$ npm install
$ npm run build
$ npm start
```

#### Desarrollo
```sh
$ npm run dev
```

#### Unit Test
```sh
$ npm run test
```
#### Autorización

Se requiere de una autorización básica con usuario y contraseña: admin, admin respectivamente
El usuario y contraseña se puede cambiar con la variable de entorno `AUTH_BASIC_USERNAME` y `AUTH_BASIC_PASSWORD`

### Rutas

Por defecto es servidor se despliega en el puerto 5000 pero pude ser cambiado con la variable de entorno `HTTP_PORT`

| Método | Path | Descripción |
| ------ | ------ | ------ |
| GET | /vehiculo | Lista de vehículos |
| GET | /vehiculo/:placa | Consulta un vehículo por su placa |
| POST | /vehiculo | Nuevo vehículo, verifica duplicidad y formato placa, Requiere **Vehículo** |
| PUT | /vehiculo/:placa | Actualiza un vehículo por su placa, verifica duplicidad y formato placa, Requiere **Vehículo** |
| DELETE | /vehiculo/:placa | Deshabilita un vehículo por su placa |
| ------ | ------ | ------ |
| GET | /todo | Consulta las tareas completas de https://jsonplaceholder.typicode.com/todos |
