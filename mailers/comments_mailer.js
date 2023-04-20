require('dotenv').config();
const nodeMailer = require('../config/nodemailer');

//this is the another way of exporting the module
exports.newComment = (comment)=>
{
    // console.log('inside newCommnet mailer');

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail(
    {
        from: process.env.USER,
        to: comment.user.email,
        subject: 'New Comment Published',
        html: htmlString
    }, (err, info)=>
        {
            if(err)
            {
                console.log('error in sending mail ', err);
                return;
            }

            // console.log('message sent ');
            return;
        }
    );
}