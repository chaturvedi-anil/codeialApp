const Post=require('../models/post');
const User=require('../models/user');

module.exports.home = function(req,res)
{
    // populate the user of each post 
    Post.find({})
    .populate('user')
    .populate(
    {
        path: 'comments',
        populate: {
            path: 'user'           
        }
    })
    .exec()
    .then((post)=>
    {
        User.find({})
        .then((users)=>
        {
            return res.render('home', {
                title: " Codeial | Home",
                posts: post,
                all_users: users
            });
        })
        .catch((err)=> 
        {
            console.log(`error in finding user in db ${err}`);
            return res.redirect('back');
        });
    })
    .catch((err)=>
    {
        console.log(`error in finding post in db ${err}`);
        return res.redirect('back');
    });
    
}

