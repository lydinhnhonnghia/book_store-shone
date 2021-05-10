const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const isEmpty = require('is-empty');
const accountService = require('../services/account');

passport.serializeUser((user, done) => {
    done(null, user.data);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, ((req, username, password, done) => {
    accountService.signInAdmin({ username, password })
        .then((response) => {
            if (!isEmpty(response) && response.success) {
                return done(null, response);
            }
            return done(null);
        }, (err) => done(null));
})));

exports.init = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
};

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/admin/sign-in');
};

exports.authenticate = (strategy, cb) => (req, res, next) => passport.authenticate(strategy, cb)(req, res, next);
