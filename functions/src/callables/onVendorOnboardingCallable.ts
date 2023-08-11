import type { User, Vendor } from '../models';

import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

import { stripe } from '../stripe';
import { firestore } from '../firebase';
import { FieldValue } from '../models';

type VendorOnboarding = Pick<
  Vendor,
  'vendorUen' | 'vendorName' | 'vendorCategory' | 'vendorPhoneNumber'
> & {
  cardNumber: string;
  cardExpMonth: number;
  cardExpYear: number;
  cardCvc: string;
};

export const onVendorOnboardingCallable = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
  },
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
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
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
      typeof cardNumber !== 'string' ||
      typeof cardExpMonth !== 'number' ||
      typeof cardExpYear !== 'number' ||
      typeof cardCvc !== 'string' ||
      vendorUen.length < 9 ||
      vendorUen.length > 10 ||
      vendorName.length === 0 ||
      !vendorCategories.includes(vendorCategory) ||
      vendorPhoneNumber.length === 0 ||
      cardNumber.length === 0 ||
      cardCvc.length === 0
    ) {
      throw new HttpsError(
        'invalid-argument',
        'Missing information, please try again later'
      );
    }

    const stripeCustomer = await stripe.customers.create({
      name: vendorName,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: userData.email!,
      phone: vendorPhoneNumber,
      metadata: { firebaseUserId: auth.uid },
    });

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCvc,
      },
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: stripeCustomer.id,
    });

    const stripeSub = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ plan: 'price_1NU1xvFc4RNZ7rpe4nfMwvCX' }],
    });

    const newVendorData: Vendor = {
      vendorId: vendorRef.id,
      vendorUen,
      vendorName,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      vendorEmail: userData.email!,
      vendorCategory,
      vendorPhoneNumber,
      stripeId: stripeCustomer.id,
      stripeStatus: stripeSub.status,
      stripeItemId: stripeSub.items.data[0].id,
      stripeSubscriptionId: stripeSub.id,
      branches: [],
      apiKeys: [],
      branchCreatedAt: FieldValue.serverTimestamp(),
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
