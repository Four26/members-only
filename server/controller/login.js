const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../db/db');
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = rows[0];

        if (!user) {
            return done(null, false, { message: 'User not found. Please sign up' });
        }

        const isMatched = await bcryptjs.compare(password, user.password);
        if (isMatched !== true) {
            return done(null, false, { message: 'Incorrect password' })
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
        const user = rows[0];
        done(null, user);
    } catch (error) {
        done(error);
    }
})

const login = asyncHandler(async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
                message: 'Login Successful',
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    membership_status: user.membership_status,
                    is_admin: user.is_admin
                }
            });
        });
    })(req, res, next);
});

module.exports = login;