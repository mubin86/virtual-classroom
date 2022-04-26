
const sendGridMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.resolve(__dirname, '../config.env') })
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

function getMessage(options) {
  console.log("options email is ", options.email);
    return {
      to: options.email,
      from: {
          name: "Company Domain Name",  //**company domain name
          email: process.env.SENDGRID_VERIFIED_EMAIL
      },
      subject: options.subject,
      text: options.message,
      html: `<strong>${options.message}</strong>`,
    };
}

const sendEmail = async options => {
try {
    return await sendGridMail.send(getMessage(options));
} catch (error) {
  console.log("email error is ", error);
    return error;
}
};

module.exports = sendEmail;
