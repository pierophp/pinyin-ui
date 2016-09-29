const env = require('../../env');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const knex = require('../services/knex');

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    knex('user')
            .where({
              id,
            })
            .then((data) => {
              done(null, data[0]);
            });
  });

  if (!env.google_client_id || !env.google_client_secret) {
    console.log('define google_client_id and google_client_secret in your env.js file');
    return;
  }

  passport.use(new GoogleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: `${env.base_url}/auth/google/callback`,
  },
        (token, refreshToken, profile, done) => {
          process.nextTick(() => {
            knex('user')
                    .where({
                      profile_id: profile.id,
                    })
                    .then((data) => {
                      if (data.length > 0) {
                        return done(null, data[0]);
                      } else {
                        knex('user').insert({
                          profile_id: profile.id,
                          token,
                          name: profile.displayName,
                          email: profile.emails[0].value,
                          created_at: new Date(),
                        }).then(() => {
                          knex('user')
                                    .where({
                                      profile_id: profile.id,
                                    })
                                    .then((data) => {
                                      return done(null, data[0]);
                                    });
                        });
                      }
                    });
          });
        }));
};
