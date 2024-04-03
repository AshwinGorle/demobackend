const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    // Activate in gmail "less secure app" option
  });

  //2) Define the email Address
  const mailOptions = {
    from: "aryanthapak.8@gmail.com",
    to: options.email,
    subject: "Request Approved",
    text: options.message,
  };

  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
