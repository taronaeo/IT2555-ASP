import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { firestore } from '../firebase';
import { User, Vendor } from '../models';
import { stripe } from '../stripe';

export const vendorStripeDetailsCallable = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
  },
  async ({ auth, data }) => {
    if (!auth) {
      logger.error(
        'onVendorStripeDetailsCallable:HttpsError',
        'failed-precondition',
        'Function must be called while authenticated'
      );

      throw new HttpsError(
        'failed-precondition',
        'Function must be called while authenticated'
      );
    }
    const userUid = auth.uid;
    const userRef = firestore.collection('users').doc(userUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      logger.error(
        'onVendorStripeDetailsCallable:HttpsError',
        'failed-precondition',
        'Function must be called while authenticated'
      );

      throw new HttpsError(
        'failed-precondition',
        'Function must be called while authenticated'
      );
    }
    const userData = userSnap.data() as User;
    const userTenantId = userData.tenantId;
    if (userTenantId !== 'support-uxfrz') {
      logger.error(
        'onVendorStripeDetailsCallable:HttpsError',
        'permission-denied',
        'No access to requested data'
      );
      throw new HttpsError('permission-denied', 'No access to requested data');
    }
    const vendorId = data;
    const vendorRef = firestore.doc(`vendors/${vendorId}`);

    const vendorSnap = await vendorRef.get();
    if (!vendorSnap.exists) {
      logger.error('Data requested does not exist');
      throw new HttpsError('not-found', 'Data requested does not exist');
    }
    try {
      const vendorData = vendorSnap.data() as Vendor;
      const vendorSubscriptionId = vendorData.stripeSubscriptionId;
      const subscription = stripe.subscriptions.retrieve(vendorSubscriptionId);
      const nextBillingDateMillis = (await subscription).current_period_end;
      logger.log(nextBillingDateMillis);
      const latestInvoice = (await subscription).latest_invoice;
      const invoiceObj = await stripe.invoices.retrieve(
        latestInvoice as string
      );
      const billingAmount = `$${(invoiceObj.amount_due / 100).toFixed(2)}`;
      return {
        billingDate: nextBillingDateMillis,
        billingAmount: billingAmount,
      };
    } catch (err) {
      logger.error(
        'vendorStripeDetailsCallable',
        'internal',
        'Internal Stripe Error'
      );
      throw new HttpsError('internal', 'Internal Stripe Error');
    }
  }
);
