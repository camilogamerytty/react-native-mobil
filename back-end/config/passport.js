// ================================================
// 🔐 CONFIGURACIÓN DE PASSPORT CON JWT
// ================================================

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Keys = require('./keys');
const User = require('../models/user');

// ================================================
// 🔹 OPCIONES DE CONFIGURACIÓN DEL JWT
// ================================================
const opts = {
    // De dónde se extrae el token (del header Authorization: Bearer <token>)
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    // Clave secreta usada para firmar/verificar el token
    secretOrKey: Keys.secretOrKey
};

// ================================================
// 🔹 DEFINICIÓN DE LA ESTRATEGIA JWT
// ================================================
passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        // jwt_payload es el contenido del token decodificado (por ejemplo, { id, email, iat, exp })
        User.findById(jwt_payload.id, (err, user) => {
            if (err) {
                return done(err, false); // Error en la consulta
            }

            if (user) {
                return done(null, user); // Usuario encontrado → autenticado correctamente
            } else {
                return done(null, false); // No se encontró el usuario → token inválido
            }
        });
    })
);

// ================================================
// 🔹 EXPORTAR CONFIGURACIÓN
// ================================================
module.exports = passport;
