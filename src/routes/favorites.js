const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const user = req.user.idUser
    const favorites = await pool.query(`SELECT users.idUser,users.nombre,users.user,peliculas.tituloPelicula,peliculas.descPelicula,categorias.categoria,categorias.categoriaDesc,peliculas.descPelicula as sinopsis,portadas.nombrePortada
                                        FROM users
                                        INNER JOIN tbl_pelifav peliculasFav ON users.idUser = peliculasFav.idUsuariofk
                                        INNER JOIN cat_peliculas peliculas ON peliculasFav.idPeliFav = peliculas.idPelicula
                                        INNER JOIN cat_categorias categorias ON peliculas.idCategoriafk = categorias.idCategoria
                                        INNER JOIN cat_portadas portadas ON peliculas.fkPortada = portadas.idPortada
                                        WHERE users.uActivo = 1 AND peliculasFav.fActivo = 1 AND peliculas.pActivo = 1 AND categorias.catActivo = 1 AND portadas.portActivo = 1 AND users.idUser = ?`, [ user ])
    res.render('favorites/listFavorites', { favorites } )
})
module.exports = router;