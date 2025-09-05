const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, html }) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true', 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
