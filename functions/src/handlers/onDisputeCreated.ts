import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

export const sendMail = functions.firestore
  .document('disputes/{disputeId}')
  .onCreate(async (snap) => {
    const gmailEmail = functions.config().gmail.email;
    const clientId = functions.config().gmail.clientid;
    const clientSecret = functions.config().gmail.clientsecret;
    const refreshToken = functions.config().gmail.refreshtoken;
    const OAuth2 = google.auth.OAuth2;
    const oAuth2Client = new OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: gmailEmail,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken.token as string,
      },
    } as nodemailer.TransportOptions); // <-- Type assertion here

    const disputeData = snap.data();
    const disputeType = disputeData.disputeType;
    const receiptId = disputeData.receiptId;
    const mailOptions = {
      from: gmailEmail,
      to: disputeData.vendorEmail,
      cc: disputeData.userEmail,
      subject: `${disputeType} dispute regarding receipt: ${receiptId}`,
      text: disputeData.description,
      attachments: [
        {
          filename: 'evidence.jpg',
          path: disputeData.evidenceUrl,
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Dispute email sent to:', disputeData.vendorEmail);
      return null;
    } catch (error) {
      console.error('There was an error while sending the email:', error);
      return null;
    }
  });
