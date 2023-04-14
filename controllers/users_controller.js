const User = require('../models/user');

module.exports.profile = function(req, res)
{
    User.findById(req.params.id)
    .then((user)=>
    {
        return res.render('user_profile',{
            title: "User Profile",
            profile_user: user
        });
    })
    .catch((err)=>
    {
        console.log(`error in showing user profile page ${err}`);
        return res.redirect('back');
    });
}

// update
module.exports.update=function(req, res)
{
    if(req.user.id == req.params.id)
    {
        User.findByIdAndUpdate(req.params.id, req.body)
        .then(()=>
        {
            console.log('updated');
            return res.redirect('/');
        })
        .catch((err)=>
        {
            console.log(`error in findind the user and updating the details ${err}`);
            return res.redirect('back');
        });
    }
    else
    {
        return res.status(401).send('Unautherized');
    }
}

// sign in
module.exports.signIn = function(req, res)
{
    // checking if user already signed in
    if(req.isAuthenticated())
    {
        return res.redirect('/');
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
        return res.redirect('/');
    }

    return res.render('sign_up', {
        title : "Sign Up Page"
    });
}

// sign in and create session for user
module.exports.createSession = function(req, res)
{
    return res.redirect('/');
}

// for sighup (registering the user in the database)
module.exports.createUser = function(req, res)
{
    if(req.body.password != req.body.confirmPassword)
    {
        return res.redirect('back');
    }
    
    User.findOne({email:req.body.email})
    .then((user)=>
    {
        if(!user)
        {
            User.create(req.body)
            .then(()=>
            {
                return res.redirect('/');
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
    })
    .catch((err)=>
    {
        if(err)
        {
            console.log("error in finding user in signingup");
            return;
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