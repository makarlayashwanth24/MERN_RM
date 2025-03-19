const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendResetPasswordEmail = async (to, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Password Reset",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
