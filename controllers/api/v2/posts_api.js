module.exports.index = function(req, res)
{
    return res.json({
        message: 'v2 list of posts',
        posts: []
    });
}