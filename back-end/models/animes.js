const mysql = require('mysql2');
const db = require('../config/config');

const Animes = {};


Animes.create = async (anime, result) => {
    try {
        const sql = `
            INSERT INTO animes (
                nombre_anime, descripcion_anime
            ) VALUES (?, ?)
        `;

        const values = [
            anime.nombre_anime,
            anime.descripcion_anime,
        ];

        db.query(sql, values, (err, res) => {
            if (err) {
                console.log('Error al crear anime:', err);
                result(err, null);
            } else {
                console.log('anime creado:', { id: res.insertId, ...anime });
                result(null, { id: res.insertId, ...anime });
            }
        });

    } catch (error) {
        console.log('Error interno al crear el anime:', error);
        result(error, null);
    }
};
module.exports = Animes;