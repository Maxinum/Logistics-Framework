const nodemailer = require("nodemailer");

/**
 * Sends an email using the provided parameters.
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The email content as plain text.
 */
const sendEmail = async (email, subject, text) => {
  // Create a nodemailer transporter using the Gmail service and authentication
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `Logistic Framework <${process.env.EMAIL_ADDRESS}>`,
    to: email,
    subject: subject,
    html: text,
  };

  try {
    // Send the email using the transporter and mail options
    await transporter.sendMail(mailOptions);
    console.log(`[INFO!] message was sent to ${subject}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
