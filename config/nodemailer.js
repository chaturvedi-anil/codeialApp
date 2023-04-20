require('dotenv').config();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter= nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:
    {
        user: "codingwa90",
        pass: process.env.PASSWORD
    },
});


let renderTemplate = (data, relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template)
        {
            if(err){console.log('error in redring template in mailers', err); return;}

            mailHTML = template;
        } 
    );

    return mailHTML;
}

module.exports = {
    transporter:transporter,
    renderTemplate:renderTemplate
}