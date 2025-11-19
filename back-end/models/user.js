const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

/* ================================
   🔹 LISTAR TODOS LOS USUARIOS
================================ */
User.findAll = (result) => {
    const sql = `
        SELECT Id_usuario,nombre_usuario,correo_usuario,contrasena,nombre_rol
        FROM usuario
    `;

    db.query(sql, (err, users) => {
        if (err) {
            console.log('Error al listar usuarios:', err);
            result(err, null);
        } else {
            console.log('Usuarios encontrados:', users.length);
            result(null, users);
        }
    });
};

/* ================================
   🔹 BUSCAR POR ID
================================ */
User.findById = (id, result) => {
    const sql = `
        SELECT Id_usuario, nombre_usuario, correo_usuario, contrasena, nombre_rol
        FROM usuario
        WHERE id = ?
    `;

    db.query(sql, [id], (err, user) => {
        if (err) {
            console.log('Error al consultar usuario por ID:', err);
            result(err, null);
        } else {
            console.log('Usuario consultado:', user[0]);
            result(null, user[0]);
        }
    });
};

/* ================================
   🔹 BUSCAR POR EMAIL
================================ */
User.findByEmail = (email, result) => {
    const sql = `
        SELECT Id_usuario, nombre_usuario, correo_usuario, contrasena, nombre_rol
        FROM usuario
        WHERE correo_usuario = ?
    `;

    db.query(sql, [email], (err, user) => {
        if (err) {
            console.log('Error al consultar usuario por email:', err);
            result(err, null);
        } else {
            console.log('Usuario consultado:', user[0]);
            result(null, user[0]);
        }
    });
};

/* ================================
   🔹 CREAR USUARIO
================================ */
User.create = async (user, result) => {
    try {
        const hash = await bcrypt.hash(user.contrasena, 10);
        const validRoles = ['admin', 'user'];
        const role = validRoles.includes(user.role) ? user.role : 'user';

        const sql = `INSERT INTO users(
                     name, 
                     lastname,
                     email, 
                     password,
                     phone,
                     image,
                     role,
                     created_at,
                     updated_at
                    ) VALUES (?,?,?,?,?,?,?,?,?)`;

        const values = [
            user.name,
            user.lastname,
            user.email,
            hash,
            user.phone,
            user.image,
            role,
            new Date(),
            new Date()  
        ];

        db.query(sql, values, (err, res) => {
            if (err) {
                console.log('Error al crear usuario:', err);
                result(err, null);
            } else {
                console.log('Usuario creado:', { id: res.insertId, ...user });
                result(null, { id: res.insertId, ...user });
            }
        });

    } catch (error) {
        console.log('Error interno al crear usuario:', error);
        result(error, null);
    }
};

/* ================================
   🔹 ACTUALIZAR USUARIO
================================ */
User.update = async (user, result) => {
    try {
        const fields = [];
        const values = [];

        if (user.contrasena) {
            const hash = await bcrypt.hash(user.contrasena, 10);
            fields.push("contrasena = ?");
            values.push(hash);
        }

        if (user.nombre_usuario) { fields.push("nombre_usuario = ?"); values.push(user.nombre_usuario); }
        if (user.correo_usuario) { fields.push("correo_usuario = ?"); values.push(user.correo_usuario); }
        if (user.nombre_rol) { fields.push("nombre_rol = ?"); values.push(user.nombre_rol); }

        const sql = `UPDATE usuario SET ${fields.join(", ")} WHERE Id_usuario = ?`;
        values.push(user.Id_usuario);

        db.query(sql, values, (err, res) => {
            if (err) {
                console.log('Error al actualizar usuario:', err);
                result(err, null);
            } else {
                result(null, { id: user.Id_usuario, ...user });
            }
        });
    } catch (error) {
        console.log('Error interno al actualizar usuario:', error);
        result(error, null);
    }
};

/* ================================
   🔹 ELIMINAR USUARIO
================================ */
User.delete = (id, result) => {
    const sql = `DELETE FROM usuario WHERE Id_usuario = ?`;

    db.query(sql, [id], (err, res) => {
        if (err) {
            console.log('Error al eliminar usuario:', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
/* ================================
   🔹 EXPORTAR MÓDULO
================================ */
module.exports = User;
