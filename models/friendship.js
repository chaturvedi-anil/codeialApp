const mongoose = require('mongoose');

const frienshipSchema = mongoose.Schema(
{
    // the user who sent this request 
    from_user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // the user who accepted this request, the naming is just to understand, otherwise, the user won't see a difference
    to_user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamp: true
});

const Friendship = mongoose.model('Friendship', frienshipSchema);

module.exports = Friendship;