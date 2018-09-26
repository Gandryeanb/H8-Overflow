const nodemailer = require('nodemailer');

const emailSender = (email) => {
    const transporter = nodemailer.createTransport({
        service: String(process.env.EMAIL_HOST),
        auth: {
            user: String(process.env.EMAIL_ID),
            pass: String(process.env.EMAIL_PASS)
        }
    });
    
    const mailOptions = {
        from: String(process.env.EMAIL_ID),
        to: `${email}`,
        subject: 'Q-Answer web',
        html: '<p>Thank for SignUp to our web app<br>Q-Answer Overflow HACKTIV8</p>'
    };
    
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
    
}

module.exports = emailSender