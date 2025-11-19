const express = require('express');
const router = express.Router();

const AnimesController = require('../controllers/animesController');

router.post('/crear_anime', AnimesController.nuevo_anime);

module.exports = router;