/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as logger from 'firebase-functions/logger';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  BlockingOptions,
  beforeUserCreated,
} from 'firebase-functions/v2/identity';

const runtime: BlockingOptions = {
  region: 'asia-southeast1',
  maxInstances: 1,
};

export const onBeforeUserCreated = beforeUserCreated(runtime, async (e) => {
  initializeApp();
  const eventData = e.data;
  const user = {
    uid: eventData.uid,
    disabled: eventData.disabled,
    display_name: eventData.displayName || 'Dr. Receipts User',
    email: eventData.email!,
    email_verified: eventData.emailVerified,
    phone_number: eventData.phoneNumber || null,
    photo_url:
      eventData.photoURL ||
      'https://api.dicebear.com/6.x/big-smile/svg?seed=Dr.%20Receipts%20User',
    tenant_id: eventData.tenantId || '[DEFAULT]',
    custom_claims: eventData.customClaims || {},
  };

  const db = getFirestore();

  logger.info('onBeforeUserCreated:userData', user);

  try {
    await db.collection('users').doc(user.uid).set(user, { merge: true });
  } catch (error) {
    logger.error('onBeforeUserCreated:error', error);
    throw error;
  }

  return {
    displayName: eventData.displayName || 'Dr. Receipts User',
  };
});
