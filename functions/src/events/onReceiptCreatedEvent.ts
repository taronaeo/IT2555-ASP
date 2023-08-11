import type { Vendor, Receipt } from '../models';

import * as logger from 'firebase-functions/logger';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

import { stripe } from '../stripe';
import { firestore } from '../firebase';

export const onReceiptCreatedEvent = onDocumentCreated(
  'receipts/{receiptId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.log('No data associated with the event');
      return;
    }

    const data = snapshot.data() as Receipt;
    const vendorRef = firestore.doc(`vendors/${data.vendor.vendorId}`);
    const vendorDoc = await vendorRef.get();
    const vendorData = vendorDoc.data() as Vendor;

    return stripe.subscriptionItems.createUsageRecord(
      vendorData.stripeItemId,
      {
        quantity: 1,
        action: 'increment',
      },
      { idempotencyKey: snapshot.id }
    );
  }
);
