// ================================================
// 🧩 CONTROLADOR DE USUARIOS
// ================================================

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

// ================================================
// 🔹 EXPORTAR MÓDULO DE CONTROLADOR
// ================================================
module.exports = {

    // ============================================
    // 🔐 LOGIN DE USUARIO
    // ============================================
    login(req, res) {
        const email = req.body.correo_usuario;
        const password = req.body.contrasena;

        User.findByEmail(email, async (err, myUser) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar el usuario',
                    error: err
                });
            }

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'El email no existe en la base de datos'
                });
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, myUser.contrasena);

            if (isPasswordValid) {
                // Generar token JWT
                const token = jwt.sign(
                    { id: myUser.Id_usuario, email: myUser.correo_usuario, role: myUser.nombre_rol },
                    keys.secretOrKey,
                    { expiresIn: '1h' } // Expira en 1 hora
                );

                // Datos que se devolverán al frontend
                const data = {
                    id: myUser.Id_usuario,
                    nombre: myUser.nombre_usuario,
                    correo: myUser.correo_usuario,
                    rol: myUser.nombre_rol,
                    session_token: `JWT ${token}`
                };

                return res.status(201).json({
                    success: true,
                    message: 'Usuario autenticado correctamente',
                    data: data
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña o correo incorrecto'
                });
            }
        });
    },

    // ============================================
    // 📋 OBTENER TODOS LOS USUARIOS
    // ============================================
    getAllUsers(req, res) {
        User.findAll((err, users) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al listar usuarios',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Lista de usuarios',
                data: users
            });
        });
    },

    // ============================================
    // 🔎 OBTENER USUARIO POR ID
    // ============================================
    getUserById(req, res) {
        const id = req.params.id;

        User.findById(id, (err, user) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar el usuario',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Usuario encontrado',
                data: user
            });
        });
    },

    // ============================================
    // 🆕 REGISTRAR NUEVO USUARIO
    // ============================================
    register(req, res) {
        const user = req.body;

        // Si no se especifica rol, asignar 'user' por defecto
        if (!user.role) {
            user.role = 'user';
        }

        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear el usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Usuario creado correctamente',
                data: data
            });
        });
    },

    // ============================================
    // ✏️ ACTUALIZAR USUARIO
    // ============================================
    getUserUpdate(req, res) {
        const user = req.body;

        User.update(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar el usuario',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Usuario actualizado correctamente',
                data: data
            });
        });
    },

    // ============================================
    // 🗑️ ELIMINAR USUARIO
    // ============================================
    getUserDelete(req, res) {
        const id = req.params.id;

        User.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al eliminar el usuario',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Usuario eliminado correctamente',
                data: data
            });
        });
    }
};
