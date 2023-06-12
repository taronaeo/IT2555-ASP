import * as logger from 'firebase-functions/logger';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { beforeUserCreated } from 'firebase-functions/v2/identity';

import { User } from '../models/User';
import { FieldValue } from '../models/Metadata';

export const onBeforeUserCreated = beforeUserCreated(async (event) => {
  logger.info('onBeforeUserCreated:init', 'Cloud Function called');

  const app = initializeApp();
  const firestore = getFirestore(app);

  const {
    data: {
      uid,
      tenantId,
      photoURL,
      displayName,
      email,
      emailVerified,
      phoneNumber,
    },
  } = event;

  const user = new User({
    uid,
    tenantId,
    photoURL,
    displayName,
    email,
    emailVerified,
    phoneNumber,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  });

  try {
    await firestore
      .doc(`users/${user.uid}`)
      .set(user.toObject(), { merge: true });

    logger.info(
      'onBeforeUserCreated:writeUser',
      'User data written to Firestore'
    );
  } catch (error) {
    logger.error(
      'onBeforeUserCreated:writeUser',
      'Failed to write data to Firestore',
      error
    );
  }

  return {};
});
