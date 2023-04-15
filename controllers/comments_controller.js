const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res)
{
    try
    {
        // finding post to do comments on it 
        let post = await Post.findById(req.body.post)
        
        let comment = await Comment.create({
            content: req.body.content,
            user: req.user._id,
            post: req.body.post
        });
        
        // adding comment object_id in comments array
        await post.comments.push(comment);
        post.save();

        if(req.xhr)
        {
            return res.status(200).json({
                data:{
                    comment:comment
                },
                message: 'comment added !'
            });
        }

        req.flash('success', 'comment add');
        return res.redirect('/');
    }
    catch(err)
    {
        console.log(`Error in creating comment ${err}`);
        return res.redirect('back');
    }
}

// deleting comment
module.exports.destroy= async function(req, res)
{
    try
    {
        let comment = await Comment.findById(req.params.id);
        
        if(comment.user == req.user.id)
        {
            let postId=comment.post;
        
            //deleting comments from comment schema
            await comment.deleteOne(comment._id);

            // pull function will delete the comment id form comments array of postSchema
            await Post.findByIdAndUpdate(postId,{$pull: { comments: req.params.id}});

            req.flash('success', 'comment delete');
            
            return res.redirect('back');
        }
        else
        {
            req.flash('error', 'you can not delete this comment');
            return res.status(401).send('Unautherized');
        }
    
    }
    catch(err)
    {
        console.log(`Error in deleting comment ${err}`);
        return res.redirect('back');
    }
}