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
      const { email, password } = req.body;

      User.findByEmail(email, async (err, myUser) => {
        if (err) {
          return res.status(501).json({
            success: false,
            message: "Error al consultar el usuario",
            error: err,
          });
        }

        if (!myUser) {
          return res.status(401).json({
            success: false,
            message: "El email no existe en la base de datos",
          });
        }

        const isPasswordValid = await bcrypt.compare(password, myUser.password);

        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: "Contraseña o correo incorrecto",
          });
        }

        const token = jwt.sign(
          { id: myUser.id, email: myUser.email, role: myUser.role },
          keys.secretOrKey,
          { expiresIn: "1h" }
        );

        const data = {
          id: myUser.id,
          email: myUser.email,
          name: myUser.name,
          lastname: myUser.lastname,
          image: myUser.image,
          phone: myUser.phone,
          role: myUser.role,
          session_token: `JWT ${token}`,
        };

        return res.status(201).json({
          success: true,
          message: "Usuario autenticado",
          data,
        });
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
