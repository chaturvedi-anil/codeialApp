const User = require('../models/user');

module.exports.signUp=function(req, res)
{
    return res.render('sign_up', {
        title : "Sign Up Page"
    });
}

// for signing the user
module.exports.createSession = function(req, res)
{
    let email=req.body.email;
    let password=req.body.password;
    User.find({email:email, password:password})
    .then((userdata) =>
    {
        let userData=userdata[0];
        return res.render('user_profile',{
            title: "User Profile",
            userData:userData,
        });
    })
    .catch((err)=>
    {
        console.log(`error in finding user ${err}`);
    });
}

// for sighup (registering the user in the database)
module.exports.createUser = function(req, res)
{
    if(req.body.password === req.body.confirmPassword)
    {
        User.create({
            email:req.body.email,
            password: req.body.password,
            name: req.body.name 
        })
        .then((newUser)=>
        {
            return res.render('home',{
                title: "Home"
            });
        })
        .catch((err)=>
        {
            console.log(`error in creating user ${err}`);
            return;
        });
    }
    else
    {
        console.log(`password should match ${password} and ${confirmPassword}`);
    }
}
