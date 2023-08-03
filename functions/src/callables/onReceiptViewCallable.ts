import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { firestore } from '../firebase';
import type { Receipt } from '../models/Receipt';

export const onReceiptViewCallable = onCall(async ({ auth, data }) => {
  if (!auth) {
    logger.error(
      'onReceiptViewCallable:HttpsError',
      'failed-precondition',
      'Function must be called while authenticated.'
    );

    throw new HttpsError(
      'failed-precondition',
      'Function must be called while authenticated'
    );
  }

  const userUid = auth.uid;
  const receiptId = data;
  const receiptRef = firestore.doc(`receipts/${receiptId}`);
  const receiptSnap = await receiptRef.get();
  if (!receiptSnap.exists) {
    logger.error('Data requested does not exist');
    throw new HttpsError('not-found', 'Data requested does not exist');
  }
  const receiptData = receiptSnap.data() as Receipt;
  const receipt: Receipt = {
    receiptId: receiptId,
    userUid: receiptData.userUid,
    vendor: receiptData.vendor,
    items: receiptData.items,
    subtotal: receiptData.subtotal,
    total: receiptData.total,
    gst: receiptData.gst,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createdAt: receiptData.createdAt.toMillis(),
    paymentMethod: receiptData.paymentMethod,
    change: receiptData.change,
  };

  const receiptUserUid = receiptData.userUid;

  if (receiptUserUid && userUid != receiptUserUid) {
    logger.error('Data access denied');
    throw new HttpsError('permission-denied', 'No Access to Requested Data');
  }

  if (!receiptUserUid || userUid == receiptUserUid) {
    return receipt;
  }
  logger.error('Unknown Error Occurred');
  throw new HttpsError('internal', 'An internal error has occurred');
});
