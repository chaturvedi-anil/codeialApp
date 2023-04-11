const User = require('../models/user');

module.exports.userProfile = function(req, res)
{
    if(req.cookies.user_id)
    {
        User.findById(req.cookies.user_id)
        .then((user)=>
        {
            if(user)
            {
                return res.render('user_profile',{
                    title: "User Profile",
                    user:user
                });
            }
            return res.redirect('/users/signIn');
        })
        .catch((err) =>
        {
            console.log(`error in finding user in database ${err}`);
            return res.redirect('/users/signIn');
        });
    }
    else
    {
        return res.redirect('/users/signIn');
    }
}

module.exports.signIn = function(req, res)
{
    return res.render('sign_in',{
        title: "Sign In"
    });
}

module.exports.signUp=function(req, res)
{
    return res.render('sign_up', {
        title : "Sign Up Page"
    });
}

// for signing the user
module.exports.createSession = function(req, res)
{
    User.findOne({email:req.body.email})
    .then((user) =>
    {
        if(user)
        {   
            if(user.password != req.body.password)
            {
                return res.redirect('back');
            }
            
            // handle session creation
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }
        else
        {
            return res.redirect('back');
        }
    })
    .catch((err)=>
    {
        console.log(`error in finding user in signing ${err}`);
        return res.redirect('back');
    });
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

module.exports.logOut = function(req, res)
{
    res.clearCookie('user_id');
    return res.redirect('/users/signIn');
}