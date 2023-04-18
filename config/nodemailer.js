const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transhporter= nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:
    {
        user: 'warriorcoder23@gmail.com',
        pass: 'Warrior23@'
    }
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
    transhporter:transhporter,
    renderTemplate:renderTemplate
}