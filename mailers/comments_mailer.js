require('dotenv').config();
const nodeMailer = require('../config/nodemailer');

//this is the another way of exporting the module
exports.newComment = (comment)=>
{
    // console.log('inside newCommnet mailer');
    nodeMailer.transporter.sendMail(
    {
        from: process.env.USER,
        to: comment.user.email,
        subject: 'New Comment Published',
        html: '<h1> Your comment is now published ! </h1>'
    }, (err, info)=>
        {
            if(err)
            {
                console.log('error in sending mail ', err);
                return;
            }

            console.log('message sent ', info);
            return;
        }
    );
}