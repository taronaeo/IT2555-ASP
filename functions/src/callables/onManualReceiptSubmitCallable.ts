import { Timestamp } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

import { z } from 'zod';
import { firestore } from '../firebase';

export const onManualReceiptSubmitCallable = onCall(({ auth, data }) => {
  if (!auth) {
    logger.error(
      'onManualReceiptSubmitCallable:HttpsError',
      'failed-precondition',
      'Function must be called while authenticated.'
    );

    throw new HttpsError(
      'failed-precondition',
      'Function must be called while authenticated'
    );
  }

  const receiptSchema = z.object({
    receiptId: z
      .string()
      .regex(
        /^[a-zA-Z0-9]+$/,
        'Receipt ID must be made up of letters and numbers, no spaces allowed.'
      ),
    vendorName: z
      .string()
      .regex(
        /^[a-zA-Z0-9 ]+$/,
        'Vendor Name must be made up of letters and numbers.'
      ),
    vendorLocation: z
      .string()
      .regex(
        /^[a-zA-Z0-9 ]+$/,
        'Vendor Location must be made up of letters and numbers.'
      ),
    postalCode: z
      .string()
      .regex(/^\d{6}$/, 'Postal code must be a valid SG postal code'),
    subtotal: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Subtotal must be made up of numbers.'),
    total: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Total must be made up of numbers.'),
    change: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Change must be made up of numbers.'),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format.'),
    paymentMethod: z
      .string()
      .regex(
        /^[a-zA-Z0-9 ]+$/,
        'Payment Method must be made up of letters and numbers.'
      ),
    gst: z
      .string()
      .regex(
        /^\d+(\.\d{1,2})?$/,
        'GST must be a number with up to two decimal places.'
      ),
  });

  const receiptData = data.receipt;
  const items = data.items;
  const validReceipt = receiptSchema.safeParse(receiptData);

  if (!validReceipt.success) {
    logger.error('Data Supplied is invalid');
    return { type: 'errorMsg', message: validReceipt.error.issues[0].message };
  }
  const date = receiptData.date;
  const time = receiptData.time;
  const combinedDateObj = new Date(`${date} ${time}`);
  const createdAt = Timestamp.fromDate(combinedDateObj);

  const userUid = auth.uid;
  const receiptRef = firestore.collection('receipts');

  const receipt = {
    userUid: userUid,
    receiptId: receiptData.receiptId,
    vendor: {
      vendorName: receiptData.vendorName,
      vendorLocation: receiptData.vendorLocation,
      postalCode: receiptData.postalCode,
    },
    items: items,
    subtotal: receiptData.subtotal,
    gst: receiptData.gst,
    total: receiptData.total,
    change: receiptData.change,
    paymentMethod: receiptData.paymentMethod,
    createdAt: createdAt,
    receiptType: 'manual',
  };

  const receiptDoc = receiptRef.doc();
  receiptDoc
    .set(receipt, { merge: true })
    .then(() => {
      logger.log(
        'onManualReceiptSubmitCallable:Success',
        'manual receipt submitted'
      );
    })
    .catch((err) => {
      logger.error('onManualReceiptSubmitCallable:HttpsError', 'internal', err);
    });
  return { type: 'receiptId', message: receiptDoc.id };
});
