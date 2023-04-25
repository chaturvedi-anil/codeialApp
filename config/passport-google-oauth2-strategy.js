// require('dotenv').config();
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env=require('./enviorment');

// tell passport to use new strategy
passport.use(new googleStrategy(
    {
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_url,
    },
    function(accessToken, refreshToken, profile, done)
    {
        // find a user
        User.findOne({email: profile.emails[0].value})
        .then((user)=>
        {
            if(user)
            {
                // if found, set this as req.user
                return done(null, user);
            }
            else
            {
                // if not fount, create user and then set is as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                .then((user)=>
                {
                    return done(null, user);
                })
                .catch((err)=>
                {
                    console.log('error in creating user google strategy-passport', err);
                    return;
                });
            }
        })
        .catch((err)=>
        {
            console.log('error in google strategy-passpoort', err);
            return;
        });
    })
);

module.exports = passport;