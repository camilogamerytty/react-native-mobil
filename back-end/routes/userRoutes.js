// ================================================
// 👥 RUTAS DE USUARIOS
// ================================================

const express = require('express');
const router = express.Router();

// Controlador de usuarios
const userController = require('../controllers/userController');

// Middlewares de autenticación y autorización
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// ================================================
// 🔹 RUTAS PÚBLICAS (sin autenticación)
// ================================================

// Crear nuevo usuario
router.post('/create', userController.register);

// Iniciar sesión (login)
router.post('/login', userController.login);


// ================================================
// 🔹 RUTAS PROTEGIDAS (requieren token válido)
// ================================================

// Obtener todos los usuarios (solo admin y seller)
router.get('/', 
    verifyToken, 
    authorizeRoles(['admin', 'seller']), 
    userController.getAllUsers
);

// Obtener usuario por ID (solo admin y seller)
router.get('/:id', 
    verifyToken, 
    authorizeRoles(['admin', 'seller']), 
    userController.getUserById
);

// Actualizar usuario (solo admin y seller)
router.put('/:id', 
    verifyToken, 
    authorizeRoles(['admin', 'seller']), 
    userController.getUserUpdate
);

// Eliminar usuario (solo admin)
router.delete('/delete/:id', 
    verifyToken, 
    authorizeRoles(['admin']), 
    userController.getUserDelete
);

// ================================================
// 🔹 EXPORTAR RUTAS
// ================================================
module.exports = router;
