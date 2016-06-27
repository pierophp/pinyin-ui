
var env = require('../../env');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var knex = require('../services/knex');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        knex('user')
            .where({
                id: id
            })
            .then(function (data) {
                done(null, data[0]);
            });
    });

    if (env.google_client_id && env.google_client_secret) {

        passport.use(new GoogleStrategy({
            clientID: env.google_client_id,
            clientSecret: env.google_client_secret,
            callbackURL: env.base_url + "/auth/google/callback"
        },
            function (token, refreshToken, profile, done) {

                process.nextTick(function () {

                    knex('user')
                        .where({
                            profile_id: profile.id
                        })
                        .then(function (data) {

                            if (data.length > 0) {
                                return done(null, data[0]);

                            } else {

                                knex('user').insert({
                                    profile_id: profile.id,
                                    token: token,
                                    name: profile.displayName,
                                    email: profile.emails[0].value,
                                    created_at: new Date()
                                }).then(function () {

                                    knex('user')
                                        .where({
                                            profile_id: profile.id
                                        })
                                        .then(function (data) {
                                            return done(null, data[0]);
                                        });

                                });

                            }
                        });


                });

            }));
    }
    else {
        console.log('define google_client_id and google_client_secret in your env.js file');
    }
}
