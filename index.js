require('dotenv').config();
const express = require('express');

const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear el Servidor Express
const app = new express();

// Configurar CORS
app.use(cors());

// Lectura y Parseo del Body
app.use(express.json());

// Base de Datos
dbConnection();

// console.log(process.env);
// Usuario Mongo: mean_user
// password Mongo: yPO7b5u7TEmJwVvn

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el Puerto', process.env.PORT);

});