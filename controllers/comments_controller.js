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