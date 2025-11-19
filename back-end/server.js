// ======================================================
// 🌐 SERVER.JS — Configuración del Servidor Express
// ======================================================

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Importar rutas
const usersRoutes = require('./routes/userRoutes');
const animesRoutes = require('./routes/animesRoutes');


// Inicializar aplicación
const app = express();

// ======================================================
// 🔹 MIDDLEWARES GLOBALES
// ======================================================

// Morgan → muestra peticiones HTTP en consola (modo dev)
app.use(logger('dev'));

// Permite procesar JSON en peticiones
app.use(express.json());

// Permite procesar datos de formularios (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Habilita CORS → permite solicitudes desde otros dominios
app.use(cors());

// ======================================================
// 🔹 RUTAS PRINCIPALES
// ======================================================

// Rutas del módulo de usuarios
app.use('/api/users', usersRoutes);
app.use('/api/animes', animesRoutes);

// ======================================================
// 🔹 ENDPOINTS DE PRUEBA
// ======================================================

app.get('/', (req, res) => {
    res.send('✅ Ruta raíz del Backend funcionando');
});

app.get('/test', (req, res) => {
    res.send('🔧 Ruta TEST: el servidor responde correctamente');
});

// ======================================================
// 🔹 MANEJO GLOBAL DE ERRORES
// ======================================================

app.use((err, req, res, next) => {
    console.error('🚨 Error detectado:', err);
    res.status(err.status || 500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message || err
    });
});

// ======================================================
// 🔹 EXPORTAR APP
// ======================================================

// Se exporta para ser usado en index.js o tests
module.exports = app;
