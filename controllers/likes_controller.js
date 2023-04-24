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
            // console.log('post like ', likeable);
        }
        else
        {
            likeable = await Comment.findById(req.query.id).populate('likes');
            // console.log('commnet like ', likeable);
        }

        // check if like already exist
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // if like already exist then delete it 
        if(existingLike)
        {
            // console.log('existing like ');
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.deleteOne(existingLike._id);
            deleted=true;
        }
        else
        {
            //else make it like 
            // console.log('new like ');
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.json(200, {
            message:'Request Successfull',
            data:{
                deleted: deleted
            }
        });
    }
    catch(err)
    {
        console.log('like error ', err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}