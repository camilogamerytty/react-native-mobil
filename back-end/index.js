// ======================================================
// 🚀 INDEX.JS — Punto de entrada del servidor
// ======================================================

const http = require('http');
const app = require('./server'); // Importa la configuración de Express

// ======================================================
// 🔹 CONFIGURACIÓN DEL SERVIDOR
// ======================================================

// Usa variables de entorno o valores por defecto
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '10.1.206.115';

// Define el puerto en la app Express
app.set('port', PORT);

// Crea el servidor HTTP usando Express
const server = http.createServer(app);

// ======================================================
// 🔹 INICIO DEL SERVIDOR
// ======================================================

server.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en: http://${HOST}:${PORT}`);
});

// ======================================================
// 🔹 MANEJO DE ERRORES (opcional, recomendado)
// ======================================================

// Si algo falla al iniciar el servidor
server.on('error', (err) => {
    console.error('🚨 Error al iniciar el servidor:', err.message);
    process.exit(1);
});

// Confirmación adicional cuando el servidor inicia correctamente
server.on('listening', () => {
    console.log('📡 Servidor escuchando solicitudes...');
});
