require('dotenv').config();
const express = require('express');

const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear el Servidor Express
const app = new express();

// Configurar CORS
app.use(cors());

// Base de Datos
dbConnection();
// console.log(process.env);
// Usuario Mongo: mean_user
// password Mongo: yPO7b5u7TEmJwVvn

// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Mundo'
    })
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el Puerto', process.env.PORT);

});