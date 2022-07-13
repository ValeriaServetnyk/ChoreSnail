import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  const accessToken = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'choresnail@gmail.com',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  const mailOptions = {
    from: 'Choresnail <choresnail@gmail.com>',
    to: 'Leraservetnik@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
  };

  const result = await transport.sendMail(mailOptions);
  return result;
}

sendMail()
  .then((result) => console.log('Email sent', result))
  .catch((err) => console.log(err));
