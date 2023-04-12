const User = require('../models/user');

module.exports.userProfile = function(req, res)
{
    return res.render('user_profile',{
        title: "User Profile"
    });
}

module.exports.signIn = function(req, res)
{
    // checking if user already signed in
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    return res.render('sign_in',{
        title: "Sign In"
    });
}

module.exports.signUp=function(req, res)
{
    // checking if user already signed in
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    return res.render('sign_up', {
        title : "Sign Up Page"
    });
}

// sign in and create session for user
module.exports.createSession = function(req, res)
{
    return res.redirect('/users/profile');
}

// for sighup (registering the user in the database)
module.exports.createUser = function(req, res)
{
    if(req.body.password != req.body.confirmPassword)
    {
        return res.redirect('back');
    }
    
    User.findOne({email:req.body.email}, function(err, user)
    {
        if(err){
            console.log("error in finding user in signingup");
            return;
        }

        if(!user)
        {
            User.create(req.body)
            .then(()=>
            {
                return res.redirect('/users/signIn');
            })
            .catch((err)=>
            {
                console.log(`error in creating user while signing up ${err}`);
                return;
            });
        }
        else
        {
            return res.redirect('back');
        }
    });
}

// logOut
module.exports.destroySession = function(req, res)
{
    req.logout(function(err)
    {
        if(err)
        {
            console.log(`error in logout function ${err}`);
        }
    });
    return res.redirect('/');
}