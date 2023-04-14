const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create= function(req, res)
{
    // finding post to do comments on it 
    Post.findById(req.body.post)
    .then((post)=>
    {
        // creating comments 
        Comment.create({
            content: req.body.content,
            user: req.user._id,
            post: req.body.post
        })
        .then((comment)=>
        {
            // adding comment object_id in comments array
            post.comments.push(comment);
            post.save();

            return res.redirect('/');
        })
        .catch((err)=>
        {
            console.log(`error in adding commnets ${err}`);

            return res.redirect('/');
        });
    })
    .catch((err)=>
    {
        console.log(`error in finding post in posts db`);
        return res.redirect('/');
    });
    
}

// deleting comment
module.exports.destroy=function(req, res)
{
    Comment.findById(req.params.id)
    .then((comment)=>
    {
        if(comment.user == req.user.id)
        {
            let postId=comment.post;
        
            //deleting comments from comment schema
            comment.deleteOne(comment._id);

            // pull function will delete the comment id form comments array of postSchema
            Post.findByIdAndUpdate(postId,{$pull: { comments: req.params.id}})
            .then(()=>
            {
                return res.redirect('back');
            })
            .catch((err)=>
            {
                console.log(`error in deleting comment id from post schema comments array ${err}`);
                return res.redirect('back');
            });

        }
    })
    .catch((err)=>
    {
        console.log(`error in finding comments in Comment Schema ${err}`);
        return res.redirect('back');
    });
}