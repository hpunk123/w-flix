const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const category = await pool.query(`SELECT * FROM cat_categorias categorias WHERE categorias.catActivo = 1`)
    const poster = await pool.query(`SELECT * FROM cat_portadas portadas WHERE portadas.portActivo = 1`)    
    res.render('titles/addTitles',{ category,poster })    
})
router.post('/loadMovie', isLoggedIn, async (req,res) =>{
    const { tituloPelicula,descPelicula,idCategoriafk,fkPortada } = req.body
    const newMovie = { tituloPelicula,descPelicula,idCategoriafk,fkPortada }
    const saveMovie = await pool.query(`INSERT INTO cat_peliculas SET ?`, [ newMovie ])
    req.flash('success','Pelicula Guardada con Exito')
    res.redirect('/titles')
})

module.exports = router;