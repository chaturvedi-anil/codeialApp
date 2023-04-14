const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/user');

// authentication using passport local strategy
passport.use(new LocalStrategy({
    // this will allow us to pass req as argument in function
    passReqToCallback: true,
    usernameField: 'email'
},function(req ,email, password, done)
{
    // find a user and establish the identity
    User.findOne({email: email})
    .then((user)=>
    {
        if((!user) || (user.password != password) )
        {
            req.flash('error', 'Invalid Username/Password');

            // error is not found but also authentication is not done
            return done(null, false);
        }

        // authentication done then return user to passport
        return done(null, user);
    })
    .catch((err)=>
    {
        req.flash('error', err);
        return done(err);
    });
}));

// serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user, done)
{
    done(null, user.id);
});

// deserilizing the user from the key in the cookies    
passport.deserializeUser(function(id, done)
{
    User.findById(id)
    .then((user)=>
    {
        done(null, user);
    })
    .catch((err)=>
    {
        if(err)
        {
            console.log('error in finding user in db ----> passport');
            return done(err);
        }
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next)
{
    // if the user is signed in, then pass on the request to the next function (controller's action)
    if(req.isAuthenticated())
    {
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
} 


passport.setAuthenticatedUser = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}

// exporting
module.exports = passport;