function getGeneralTemplate(message, actionUrl, actionButtonText) {
  const body = `font-family: Roboto; background-color: #f4f4f4; color: #333; padding: 20px;`;
  const container = `max-width: 400px; margin: 0 auto; background-color: #fff; padding: 20px;`;
  const messageText = `font-size: 16px; line-height: 1.5em;`;
  const linkContainer = `text-align: center; margin: 30px;`;
  const actionLink = `display: inline-block; background-color: #007bff; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 45px; border-radius: 3px;`;
  const smallText = `font-size: 14px; color: #717171`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Welcome to Our Site!</title>
    </head>
    <body style="${body}">
      <div style="${container}">
        <p style="${messageText}">${message}</p>

        <div style="${linkContainer}">
          <a href="${actionUrl}" style="${actionLink}">${actionButtonText}</a>
        </div>

        <p style="${smallText}">If you didn't make this request, you can ignore this email.</p>
        <p style="${smallText}">Thank you,</p>
        <p style="${smallText}"><b>The Maxinum Team</b></p>
      </div>
    </body>
    </html>
  `;
}

const messages = {
  invitation: function (companyName, url) {
    return getGeneralTemplate(
      `<b>${companyName}</b> invites you to <b>Freight Simulator</b>`,
      url,
      "Click here to sign up"
    );
  },
  forgot: function (url) {
    return getGeneralTemplate(
      "We received a request to <b>reset your password</b> for your account at <b>Freight Simulator</b>",
      url,
      "Reset your password"
    );
  },
};

module.exports = messages;
