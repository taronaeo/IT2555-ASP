import * as logger from 'firebase-functions/logger';

import { firestore } from '../firebase';
import { onRequest } from 'firebase-functions/v2/https';
import { FieldValue } from '../models';

export const onHttpReceiptSubmit = onRequest(async (req, res) => {
  const cors = (await import('cors'))({ origin: true });

  cors(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ status: 405, message: 'Method not allowed' });
    }

    const vendorsRef = firestore.collection('vendors');
    const receiptsRef = firestore.collection('receipts');

    const apiKey = req.get('API-Key');
    const apiSecret = req.get('API-Secret');

    if (
      !apiKey ||
      !apiSecret ||
      typeof apiKey !== 'string' ||
      typeof apiSecret !== 'string' ||
      apiKey.length === 0 ||
      apiSecret.length === 0
    ) {
      logger.error(
        'onHttpReceiptSubmit:HttpsError',
        'invalid-argument',
        'Missing headers \'API-Key\' and \'API-Secret\'',
        req.rawHeaders
      );

      res.status(400).json({
        status: 400,
        message: 'Missing headers \'API-Key\' and \'API-Secret\'',
      });
    }

    const data = req.body;
    const userId = data.userUid;
    const branchId = data.branchId;
    const vendorId = data.vendor['vendorId'];

    if (
      !userId ||
      !branchId ||
      !vendorId ||
      typeof userId !== 'string' ||
      typeof branchId !== 'string' ||
      typeof vendorId !== 'string' ||
      userId.length === 0 ||
      branchId.length === 0 ||
      vendorId.length === 0
    ) {
      logger.error(
        'onHttpReceiptSubmit:HttpsError',
        'invalid-argument',
        'Missing body \'userUid\', \'branchId\', \'vendorId\'',
        req.rawHeaders
      );

      res.status(400).json({
        status: 400,
        message: 'Missing body \'userUid\', \'branchId\', \'vendorId\'',
      });
    }

    const query = vendorsRef
      .where('vendorId', '==', vendorId)
      .where('apiKeys', 'array-contains', {
        branchId: branchId,
        key: apiKey,
        secret: apiSecret,
      })
      .limit(1);

    const querySnapshot = await query.get();
    if (querySnapshot.docs.length === 0) {
      res
        .status(400)
        .json({ status: 400, message: 'Invalid API-Key or API-Secret' });
    }

    const vendorLocation = data.branchLocation;
    const vendorName = data.vendor.vendorName;
    const postalCode = data.branchPostal;

    const items = data.items;
    const subtotal = data.subtotal;
    const gst = data.gst;
    const total = data.total;
    const change = data.change;
    const paymentMethod = data.paymentMethod;

    const receiptDoc = receiptsRef.doc();
    const receiptData = {
      userUid: userId,
      receiptId: receiptDoc.id,
      vendor: {
        vendorId,
        vendorName,
        vendorLocation,
        postalCode,
      },
      items,
      subtotal,
      gst,
      total,
      change,
      paymentMethod,
      createdAt: FieldValue.serverTimestamp(),
    };

    try {
      await receiptDoc.set(receiptData, { merge: true });
      res.status(200).json({ status: 200, message: receiptDoc.id });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ status: 500, message: 'Internal server error ' });
    }
  });
});
