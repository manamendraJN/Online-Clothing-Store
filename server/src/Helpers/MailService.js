const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_KEY
    },
});


//send the mail with transporter object
exports.sendMail = async (options)=>{
    try {
        const result = await transporter.sendMail(options);
        console.log('message sent: %s', result.messageId);
        return result;
    } catch (error) {
        console.log('error sending email');
        return error;
    }

};