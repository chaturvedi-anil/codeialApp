const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.create = function(req, res)
{
    try
    {
        Post.create({
            content: req.body.content,
            user: req.user._id,
        })
        req.flash('success', 'post published');

        return res.redirect('back');
    }
    catch(err)
    {
        console.log(`error in creating post ${err}`);
        return res.redirect('back');
    }
}


// deleting post

module.exports.destroy= async function(req, res)
{
    try
    {
        let post = await Post.findById(req.params.id);
        // .id means converting the objectId into string
        if(post.user == req.user.id)
        {
            post.deleteOne(post._id);
            // delete all the comments associated to that post
            Comment.deleteMany({post: req.params.id})
            .then(()=>
            {
                req.flash('success', 'post and associate comment delete');
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
    }
    catch(err)
    {
        console.log(`error in deleting the post from the db ${err}`);
        return res.redirect('back');
    };
}

