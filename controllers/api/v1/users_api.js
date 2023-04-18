const User = require('../../../models/user'); 
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res)
{
    try
    {
        let user= await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password)
        {
            return res.json(422, {
                message: 'invalid username/ password'
            });
        }

        return res.json(200, {
            message: 'sign in successful, here is your token, please keep it safe',
            data:
            {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '100000'})
            }
        });
    }
    catch(err)
    {
        console.log('******** ', jwt);
        return res.json(500,{
            meassage:' Internal server error'
        });
    }

}