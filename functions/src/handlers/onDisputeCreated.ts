import type { Vendor } from '../models';

import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import * as logger from 'firebase-functions/logger';
import { firestore } from '../firebase';

export const sendMail = functions.firestore
  .document('disputes/{disputeId}')
  .onCreate(async (snap) => {
    const gmailEmail = process.env.GMAIL_EMAIL;
    const clientId = process.env.GMAIL_CLIENTID;
    const clientSecret = process.env.GMAIL_CLIENTSECRET;
    const refreshToken = process.env.GMAIL_REFRESHTOKEN;
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

    const vendor = await firestore.doc(`vendors/${disputeData.vendorId}`).get();
    const vendorData = vendor.data() as Vendor;
    const mailOptions = {
      from: gmailEmail,
      to: vendorData.vendorEmail,
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
      logger.info('Dispute email sent to:', vendorData.vendorEmail);
      return null;
    } catch (error) {
      logger.error('There was an error while sending the email:', error);
      return null;
    }
  });
