const User = require('../models/user');

module.exports.profile = async function(req, res)
{
    try
    {
        let user= await User.findById(req.params.id);

        return res.render('user_profile',{
            title: "User Profile",
            profile_user: user
        });
    }
    catch(err)
    {
        console.log(`error in showing user profile page ${err}`);
        return res.redirect('back');
    }
}

// update
module.exports.update= async function(req, res)
{
    try
    {
        if(req.user.id == req.params.id)
        {
            await User.findByIdAndUpdate(req.params.id, req.body);
            
            req.flash('success', 'User details updated');
            
            return res.redirect('/');
        }
        else
        {
            return res.status(401).send('Unautherized');
        }
    }
    catch(err)
    {
        console.log(`Error in updating user details ${err}`);
        return res.redirect('back');
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


// for sighup (registering the user in the database)
module.exports.createUser = async function(req, res)
{
    try
    {
        if(req.body.password != req.body.confirmPassword)
        {
            req.flash('error', 'password and confirm password should be same');
            return res.redirect('back');
        }
        
        let user= await User.findOne({email:req.body.email});
        if(!user)
        {
            await User.create(req.body);
            req.flash('success', 'Successfully sign up');

            return res.redirect('/');
        }
    }
    catch(err)
    {
        console.log(`error in finding user in signingup ${err}`);
        return res.redirect('back');
    }
}

// sign in and create session for user
module.exports.createSession = function(req, res)
{
    // first is state, 2nd is messaged to be displayed
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
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

    req.flash('success', 'You have logged out!');
    return res.redirect('/');

}