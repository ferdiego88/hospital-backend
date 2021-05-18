require('dotenv').config();
const path = require('path');
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

// Directorio Publico
app.use(express.static('public'));

// console.log(process.env);
// Usuario Mongo: mean_user
// password Mongo: yPO7b5u7TEmJwVvn

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busqueda'));
app.use('/api/uploads', require('./routes/uploads'));

// Configurar ruta global
app.get('*', (req, res) => {
   res.sendFile( path.resolve(__dirname, 'public/index.html') ) 
});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el Puerto', process.env.PORT);

});