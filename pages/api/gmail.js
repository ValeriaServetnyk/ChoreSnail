import { config } from 'dotenv-safe';
import { google } from 'googleapis';
import { request } from 'http';
import nodemailer from 'nodemailer';

config();

export default function createEmailHandler(req, res) {
  if (req.method === 'POST') {
    if (
      typeof req.body.participantName !== 'string' ||
      !req.body.participantName ||
      typeof req.body.participantEmail !== 'string' ||
      !req.body.participantEmail
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
      from: 'Choresnail <choresnail@gmail.com>',
      to: 'Leraservetnik@gmail.com',
      // request.body.email,
      subject: 'Sending Email using Node.js',
      text: 'That was easy!',
    });
    response.status(200).json({ mailData: mailData });
    return;
  }
  res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
