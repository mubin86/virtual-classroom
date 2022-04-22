
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

function getMessage(options) {
    return {
      to: options.email,
      from: {
          name: "Your Company Domain",  //**company domain name
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
    return error;
}
};

module.exports = sendEmail;
