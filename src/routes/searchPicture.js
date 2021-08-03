const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    res.render('searchPicture/listPicture')    
})
router.post('/searching',isLoggedIn,async(req,res) =>{
    const { title } = req.body    
    const buscaPeli = await pool.query(`SELECT * FROM cat_peliculas peliculas INNER JOIN cat_portadas portadas ON peliculas.fkPortada = portadas.idPortada
                                        WHERE tituloPelicula LIKE concat('%', ? ,'%') AND pActivo = 1`, [ title ]) 
    console.log(buscaPeli)   
    res.render('searchPicture/listPicture', { buscaPeli })
})
router.post('/searchProfile',isLoggedIn,async(req,res) =>{
    const { title } = req.body    
    const buscaPeli = await pool.query(`SELECT * FROM cat_peliculas peliculas INNER JOIN cat_portadas portadas ON peliculas.fkPortada = portadas.idPortada
                                        WHERE tituloPelicula LIKE concat('%', ? ,'%') AND pActivo = 1`, [ title ])    
    console.log(buscaPeli)
    res.render('searchPicture/listPicture', { buscaPeli })    
})

module.exports = router;