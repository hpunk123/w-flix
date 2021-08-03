const express  = require('express');
const router  = express.Router();
const pool = require('../database')


const passport =require('passport');
const {isLoggedIn,inNotLoggedIn} = require('../lib/auth');

router.get('/signup', inNotLoggedIn, (req,res) =>{
    res.render('auth/signup');
});

router.post('/signup', inNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect : '/profile',
    failureRedict : '/signup',
    failureFlash: true
}));

router.get('/signin', inNotLoggedIn, (req,res) => {
    res.render('auth/signin');
});

router.post('/signin', inNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect : '/profile',
        failureRedirect : '/signin',
        failureFlash : true
    })(req,res,next);
});

router.get('/profile', isLoggedIn, async(req,res) => {
    const lastAdd = await pool.query(`SELECT peliculas.tituloPelicula,categorias.categoria,peliculas.descPelicula,portadas.nombrePortada
                                      FROM cat_peliculas peliculas
                                      INNER JOIN cat_categorias categorias ON peliculas.idCategoriafk = categorias.idCategoria
                                      INNER JOIN cat_portadas portadas ON peliculas.fkPortada = portadas.idPortada
                                      WHERE peliculas.pActivo = 1 ORDER BY peliculas.pCreado DESC LIMIT 3`)    
    res.render('profile', { lastAdd });

    
});

router.get('/logout', isLoggedIn, (req,res) =>{
    req.logOut();
    res.redirect('/signin'); 
});
module.exports = router;