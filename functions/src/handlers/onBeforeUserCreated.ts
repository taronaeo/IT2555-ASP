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
      emailVerified,
      email,
      phoneNumber,
      displayName,
      photoURL,
    },
  } = event;

  const user: User = {
    uid,
    uen: null,
    tenantId: tenantId ?? null,
    emailVerified,
    email: email ?? null,
    phoneNumber: phoneNumber ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  };

  try {
    await firestore.doc(`users/${user.uid}`).set(user, { merge: true });

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
