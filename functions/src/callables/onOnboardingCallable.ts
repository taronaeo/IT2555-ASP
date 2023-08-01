import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

import type { User } from '../models';
import { firestore } from '../firebase';

export const onOnboardingCallable = onCall(({ auth, data, rawRequest }) => {
  if (!auth) {
    logger.error(
      'onOnboardingCallable:HttpsError',
      'failed-precondition',
      'Function must be called while authenticated.',
      rawRequest.headers
    );

    throw new HttpsError(
      'failed-precondition',
      'Function must be called while authenticated'
    );
  }

  const uid = auth.uid;
  const displayName: string = data.displayName;
  const phoneNumber: string = data.phoneNumber;

  if (
    !(typeof displayName === 'string') ||
    displayName.length === 0 ||
    !(typeof phoneNumber === 'string') ||
    phoneNumber.length === 0
  ) {
    logger.error(
      'onOnboardingCallable:HttpsError',
      'invalid-argument',
      `Function must be called with arguments 'displayName'
      and 'phoneNumber' to onboard the user`,
      rawRequest.headers
    );

    throw new HttpsError(
      'invalid-argument',
      `Function must be called with arguments 'displayName'
        and 'phoneNumber' to onboard the user`
    );
  }

  const userRef = firestore.doc(`users/${uid}`);
  const setData = {
    displayName,
    phoneNumber,
    metadata: { onboarded: true },
  } as Partial<User>;

  return userRef
    .set(setData, { merge: true })
    .then(() => ({ code: 200, message: 'Onboarding successful' }))
    .catch((err) => {
      logger.error(
        'onOnboardingCallable:HttpsError',
        'unknown',
        'Error onboarding user',
        err
      );

      throw new HttpsError('unknown', 'Error onboarding user');
    });
});
