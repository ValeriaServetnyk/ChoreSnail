import { config } from 'dotenv-safe';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

config();

export default function createEmailHandler(req, res) {
  if (req.method === 'POST') {
    const req_body = req.body;
    console.log();
    if (
      typeof req_body.name !== 'string' ||
      !req_body.name ||
      typeof req_body.email !== 'string' ||
      !req_body.email
    ) {
      console.log(req.body.participantEmail);
      res.status(400).json({ errors: [{ message: 'Invalid name or email' }] });
      return;
    }
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUrl = process.env.REDIRECT_URL;
    const refreshToken = process.env.REFRESH_TOKEN;

    const myOAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUrl,
    );

    myOAuth2Client.setCredentials({ refresh_token: refreshToken });

    const myAccessToken = myOAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'choresnail@gmail.com',
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: myAccessToken,
      },
    });
    const mailData = transporter.sendMail({
      from: 'Choresnail 🐌  <choresnail@gmail.com>',
      to: req_body.email,
      subject: `${req_body.name} you have got stuff to do`,
      text: JSON.stringify(req_body.message),
      html: `<h2> Here is your task: </h2> <p>${req_body.message}</p>`,
    });
    res.status(200).json({ mailData: mailData });
    return;
  }
  res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
