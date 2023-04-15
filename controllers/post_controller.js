const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.create = async function(req, res)
{
    try
    {
        let post =await Post.create({
            content: req.body.content,
            user: req.user._id,
        });

        // checking if req is xhr (xmlHttpRequest)
        if(req.xhr)
        {
            return res.status(200).json({
                data:{
                    post: post
                },
                message: 'post create!'
            });
        }

        req.flash('success', 'post published');
        return res.redirect('back');
    }
    catch(err)
    {
        req.flash('error', err);
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
            await Comment.deleteMany({post: req.params.id});

            // ajax response
            if(req.xhr)
            {
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: 'post deleted!'
                });
            }

            req.flash('success', 'post and associate comment delete');
            return res.redirect('back');
        }
        else
        {
            req.flash('error', 'You can not delete this post !');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error', err);
        return res.redirect('back');
    };
}

