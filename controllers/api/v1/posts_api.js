const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res)
{
    // populate the user of each post 
    let post= await Post.find({})
    .sort('-createdAt')
    .populate({
        path: 'user',
        // select all field except password
        select: '-password'
    })
    .populate(
    {
        path: 'comments',
        populate: {
            path: 'user',
            select: '-password'           
        }
    });

    return res.json({
        message: 'list of post',
        posts: post
    });
}

// delete
module.exports.destroy= async function(req, res)
{
    try
    {
        let post = await Post.findById(req.params.id);
        post.deleteOne(post._id, {projection: { password: 0 }});
        // delete all the comments associated to that post
        await Comment.deleteMany({post: req.params.id});
        return res.json(200,
            {
            message:'post and associate comment delete'
        });
    }
    catch(err)
    {
        console.log(err);
        return res.json(500,{
            message:'Internal server error'
        });
    };
}
