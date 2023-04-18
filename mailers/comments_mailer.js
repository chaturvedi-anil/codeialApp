const nodeMailer = require('../config/nodemailer');

//this is the another way of exporting the module
exports.newComment = (comment)=>
{
    console.log('inside newCommnet mailer');

    nodeMailer.transhporter.sendMail({
        from: 'chaturvediwork16@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published',
        html: '<h1> Your comment is now published ! </h1>'
    }, (err, info)=>{
        if(err)
        {
            console.log('error in sending mail ', err);
            return;
        }

        console.log('message sent ', info);
        return;
    })
}