const nodemailer = require("nodemailer");

const { EMAIL_FROM, EMAIL_FROM_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_FROM_PASS,
  },
});

const sendConfirmationEmail = (name, email, confirmationCode, next) => {
  transporter
    .sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: "Подтверждение регистрации",
      html: `<h1>Подтвердите Вашу регистрацию</h1>
          <h2>Здравствуйте, ${name}</h2>
          <p>Спасибо за регистрацию. Пожалуйста, подтвердите регистрацию по ссылке ниже</p>
          <a href=http://localhost:4010/api/users/confirm/${confirmationCode}>Нажмите на эту ссылку</a>`,
    })
    .catch(next);
};

module.exports = sendConfirmationEmail;
