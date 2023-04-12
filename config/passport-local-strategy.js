const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/user');

// authentication using passport local strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
},function(email, password, done)
{
    // find a user and establish the identity
    User.findOne({email: email})
    .then((user)=>
    {
        if((!user) || (user.password != password) )
        {
            console.log('Invalid username/password');

            // error is not found but authentication is not done
            return done(null, false);
        }

        // authentication done then return user to passport
        return done(null, user);
    })
    .catch((err)=>
    {
        if(err)
        {
            console.log('error in finding user ----> passport');
            return done(err);
        }
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


// exporting
module.exports = passport;