const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '424424342368-h4hqgltlvrdas2jdm846q97v8utklan2.apps.googleusercontent.com',
      clientSecret: 'enFCoV3kgcPL2VM_uNTFq9LM',
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    // Google will send back the token and profile
    (token, refreshToken, profile, done) => {
      // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
      // console.log('---', 'in verification callback', profile, '---');

      const info = {
        email: profile.emails[0].value,
        imageUrl: profile.photos ? profile.photos[0].value : undefined
      };

      User.findOrCreate({
        where: { googleId: profile.id },
        defaults: info
      })
        .spread(user => {
          done(null, user);
        })
        .catch(done);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
});

// Google authentication and login (GET /auth/google)
router.get('/', passport.authenticate('google', { scope: 'email' }));

// handles the callback after Google has authenticated the user (GET /auth/google/callback)
router.get(
  '/callback',
  passport.authenticate('google', {
    successRedirect: '/home', // or wherever
    failureRedirect: '/' // or wherever
  })
);

module.exports = router;
