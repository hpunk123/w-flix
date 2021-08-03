const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, user, contrasenia, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE uActivo = 1 and user = ?', [user]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contrasenia, user.contrasenia);

        if (validPassword) {
            done(null, user, (user.user));
        } else {
            done(null, false, req.flash('message', 'Constraseña Invalida'));
        }
    } else {
        return done(null, false, req.flash('message', 'Usuario Invalido !'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'contrasenia',
    passReqToCallback: true

}, async (req, user, contrasenia, done) => {
    const { nombre,areafk,rolfk,uActivo } = req.body;
    const newUser = {
        nombre,
        user,        
        contrasenia,
        areafk,
        rolfk,
        uActivo     
    }
    try {
        newUser.contrasenia = await helpers.encryptPassword(contrasenia);
        const result = await pool.query('INSERT INTO users SET ?', [newUser]);
        newUser.idUser = result.insertId;
        return done(null, newUser);

    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            return done('error');

        }
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.idUser)
});
passport.deserializeUser(async (idUser, done) => {
    const rows = await pool.query('SELECT * FROM users INNER JOIN areas on users.areafk = areas.idArea WHERE idUser = ?', [idUser]);
    done(null, rows[0]);
});