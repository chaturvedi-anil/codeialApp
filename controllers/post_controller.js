const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.create = function(req, res)
{
    Post.create({
        content: req.body.content,
        user: req.user._id,
    })
    .then(()=>
    {
        console.log('post added');
        return res.redirect('back')
    })
    .catch((err)=>
    {
        console.log(`error in creating post`);
        return res.redirect('back');
    });
}


// deleting post

module.exports.destroy= function(req, res)
{
    Post.findById(req.params.id)
    .then((post) =>
    {
        // .id means converting the objectId into string
        if(post.user == req.user.id)
        {
            post.deleteOne(post._id);
            console.log('done');
            // delete all the comments associated to that post
            Comment.deleteMany({post: req.params.id})
            .then(()=>
            {
                console.log('post deleted');
                return res.redirect('back');
            })
            .catch((err)=>
            {
                console.log(`error in deleting the comments ${err}`);
                return res.redirect('back');
            });
        }
        else
        {
            console.log(`unautherised user trying to delete post`);
            return res.redirect('back');
        }
    })
    .catch((err)=>
    {
        console.log(`error in finding the post in db ${err}`);
        return res.redirect('back');
    });
}

