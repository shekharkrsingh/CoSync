const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.AUTH_MAIL_HOST,
            auth: {
                user: process.env.AUTH_MAIL_USER,
                pass: process.env.AUTH_MAIL_PASSWORD
            },
            secure: false
        })
        let info = await transporter.sendMail(
            {from: `CoSync <${process.env.AUTH_MAIL_USER}`, to: `${email}`, subject: `${title}`, html: `${body}`}
        )
        console.log(info.response)
        return info
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}
module.exports = mailSender