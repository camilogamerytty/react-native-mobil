// ================================================
// 🔐 MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN
// ================================================

const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

// ================================================
// 🔹 VERIFICAR TOKEN JWT
// ================================================
// Se asegura de que el cliente envíe un token válido en los headers
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Si no hay header Authorization → error
    if (!authHeader) {
        return res.status(403).json({
            success: false,
            message: 'No se proporcionó un token'
        });
    }

    // El formato debe ser: "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Formato de token inválido'
        });
    }

    // Verificar si el token es válido y no ha expirado
    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado',
                error: err
            });
        }

        // Guardamos los datos del usuario (id, email, role) en la request
        req.user = decoded;
        next(); // Permitir el paso a la siguiente función/ruta
    });
}

// ================================================
// 🔹 AUTORIZAR ROLES ESPECÍFICOS
// ================================================
// Verifica si el usuario tiene un rol permitido para acceder a una ruta
function authorizeRoles(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado: se requiere rol ${roles.join(' o ')}`
            });
        }
        next();
    };
}

// ================================================
// 🔹 EXPORTAR FUNCIONES
// ================================================
module.exports = {
    verifyToken,
    authorizeRoles
};
