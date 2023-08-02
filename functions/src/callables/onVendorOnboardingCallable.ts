import { FieldValue, type User, type Vendor } from '../models';

import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

import { firestore } from '../firebase';

type VendorOnboarding = Pick<
  Vendor,
  'vendorUen' | 'vendorName' | 'vendorCategory' | 'vendorPhoneNumber'
>;

export const onVendorOnboardingCallable = onCall(
  async ({ auth, data, rawRequest }) => {
    if (!auth) {
      logger.error(
        'onVendorOnboardingCallable:HttpsError',
        'failed-precondition',
        'Function must be called while authenticated',
        rawRequest.header
      );

      throw new HttpsError(
        'failed-precondition',
        'Function must be called while authenticated'
      );
    }

    const userRef = firestore.collection('users').doc(auth.uid);
    const vendorRef = firestore.collection('vendors').doc();
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      logger.error(
        'onVendorOnboardingCallable:HttpsError',
        'failed-precondition',
        'Function must be called while authenticated',
        rawRequest.header
      );

      throw new HttpsError(
        'failed-precondition',
        'Function must be called while authenticated'
      );
    }

    const userData = userSnapshot.data() as User;
    if (userData.tenantId !== 'vendors-kjv3b' || userData.vendorId !== null) {
      logger.error(
        'onVendorOnboardingCallable:HttpsError',
        'failed-precondition',
        'Function must be called using a valid vendor user',
        rawRequest.header
      );

      throw new HttpsError(
        'failed-precondition',
        'Function must be called using a valid vendor user'
      );
    }

    const {
      vendorUen,
      vendorName,
      vendorCategory,
      vendorPhoneNumber,
    }: VendorOnboarding = data;

    const vendorCategories = [
      'F&B',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Others',
    ];

    if (
      typeof vendorUen !== 'string' ||
      typeof vendorName !== 'string' ||
      typeof vendorCategory !== 'string' ||
      typeof vendorPhoneNumber !== 'string' ||
      vendorUen.length < 9 ||
      vendorUen.length > 10 ||
      vendorName.length === 0 ||
      !vendorCategories.includes(vendorCategory) ||
      vendorPhoneNumber.length === 0
    ) {
      throw new HttpsError(
        'invalid-argument',
        `Function must be called with
          arguments 'vendorUen', 'vendorName', 'vendorCategory',
          'vendorPhoneNumber'`
      );
    }

    const newVendorData: Vendor = {
      vendorId: vendorRef.id,
      vendorUen,
      vendorName,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      vendorEmail: userData.email!,
      vendorCategory,
      vendorPhoneNumber,
      branches: [],
      apiKeys: [],
    };

    const updatedUserData = {
      ...userData,
      vendorId: vendorRef.id,
      phoneNumber: vendorPhoneNumber,
      displayName: vendorName,
      isOnboarded: true,
      updatedAt: FieldValue.serverTimestamp(),
    };

    const batch = firestore.batch();
    batch.create(vendorRef, newVendorData);
    batch.update(userRef, updatedUserData);

    return batch
      .commit()
      .then(() => ({ code: 200, message: 'Vendor onboarding successful' }))
      .catch((err) => {
        logger.error(
          'onVendorOnboardingCallable',
          'unknown',
          'Error onboarding vendor',
          err
        );

        throw new HttpsError('unknown', 'Error onboarding vendor');
      });
  }
);
