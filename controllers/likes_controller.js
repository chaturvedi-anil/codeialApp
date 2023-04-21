const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.toggleLike = async function(req, res)
{
    try
    {
        // likes/toggle/?=....&type=Post
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post')
        {
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else
        {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if like already exist
        let existingLike = await Like.findOne({
            likebale: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // if liek already exist then delete it 
        if(existingLike)
        {
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted=true;
        }
        else
        {
            //else make it like 

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query._id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return req.json(200, {
            message:'Request Successfull',
            data:{
                deleted: deleted
            }
        })
    }
    catch(err)
    {
        console.log('like error ', err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}