// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(global.SENDGRID_API_KEY)
exports.send = async (to, subject, body) => {
    sgMail
    .send({
        to: to,
        from: 'test@test.com',
        subject: subject,
        text:'',
        html:body
    });
}