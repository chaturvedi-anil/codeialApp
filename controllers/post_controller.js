const Post=require('../models/post');
const Comment=require('../models/comment');
const Like = require('../models/like');

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
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();
            
            return res.status(200).json(
            {
                data:{
                    post: post
                },
                message: 'post created!'
            });
        }

        req.flash('success', 'post published');
        return res.redirect('back');
    }
    catch(err)
    {
        req.flash('error', err);

        // added this to view the error on console as well
        console.log(err);
        
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
            // CHANE :: delete all associate like and all its comments likes too
            await Like.deleteMany({likable: post, onModel: 'Post'});
            await Like.deleteMany({_id:{$in: post.comments}});


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

