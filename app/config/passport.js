const env = require('../../env');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const knex = require('../services/knex');

module.exports = function passportConfig(passport) {
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
    throw new Error('define google_client_id and google_client_secret in your env.js file');
  }

  const googleOpts = {
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: `${env.base_url}/auth/google/callback`,
  };

  passport.use(new GoogleStrategy(googleOpts,
    (token, refreshToken, profile, done) => {
      process.nextTick(() => {
        knex('user')
          .where({
            profile_id: profile.id,
          })
          .then((data) => {
            if (data.length > 0) {
              done(null, data[0]);
              return;
            }

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
                .then(user => done(null, user[0])
                );
            });
          });
      });
    }));
};
