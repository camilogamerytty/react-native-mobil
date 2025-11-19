const Animes = require('../models/animes')

const AnimesController = {};

module.exports={
    //crear nuevo anime
    nuevo_anime(req, res){
        const animes = req.body;
        Animes.create(animes, (err, data) => {

            if (err) {
            return res.status(501).json({
                success: false,
                message: 'Error al registrar anime',
                error: err
            });
        }

        return res.status(201).json({
            success: true,
            message: 'anime creado correctamente',
            data: data
        });
    });
        
    }
}
