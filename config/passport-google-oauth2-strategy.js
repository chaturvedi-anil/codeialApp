const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use new strategy
passport.use(new googleStrategy(
    {
        clientID: "284155731957-6a0o8q7ljjpo39968u6e5rup01ggc8cj.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"

    },
    function(accessToken, refreshToken, profile, done)
    {
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user)
        {
            if(err)
            {
                console.log('error in google strategy-passpoort', err);
                return;
            }

            console.log(profile);

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
        });
    })
);

module.exports = passport;