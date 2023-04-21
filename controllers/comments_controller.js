const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer = require('../mailers/comments_mailer');
const queue=require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function(req, res)
{
    try
    {
        // finding post to do comments on it 
        let post = await Post.findById(req.body.post)
        
        if(post)
        {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });
            
            // adding comment object_id in comments array
            post.comments.push(comment);
            post.save();
    
            // comment = await comment.populate('user');
            comment = await comment.populate('user', 'name email');
            // commentMailer.newComment(comment); 

            let job=queue.create('emails', comment).save(function(err)
            {
                if(err)
                {
                    console.log('error in creating a queue', err);
                    return;
                }
                // console.log("job enqueued", job.id);
            });
            if(req.xhr)
            {
                return res.status(200).json({
                    data:{
                        comment:comment
                    },
                    message: 'comment added !'
                });
            }
        }

        req.flash('success', 'comment published');
        return res.redirect('/');
    }
    catch(err)
    {
        req.flash('error', err);
        return;
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

            // CHANE :: deleting the associate like for the comment 
            await Like.deleteMany({likable: comment._id, onModel:'Comment'});

            // sent the comment id which was delete back to the views
            if(res.xhr)
            {
                return res.status(200).json({
                    data:{
                        comment_id: req.params.id
                    },
                    message: 'Comment deleted!'
                });
            }
            
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