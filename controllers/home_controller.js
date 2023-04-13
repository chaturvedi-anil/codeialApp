const Post=require('../models/post');

module.exports.home = function(req,res)
{
    // populate the user of each post 
    Post.find({}).populate('user').exec()
    .then((post)=>
    {
        return res.render('home', {
            title: " Codeial | Home",
            posts: post
        });
    })
    .catch((err)=>
    {
        console.log(`error in finding post in db ${err}`);
        return res.redirect('back');
    });
    
}

