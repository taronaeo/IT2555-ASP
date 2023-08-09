import * as logger from 'firebase-functions/logger';

import { webcrypto } from 'crypto';
import { firestore } from '../firebase';
import { onRequest } from 'firebase-functions/v2/https';
import { FieldValue, Receipt } from '../models';

export const onHttpReceiptSubmit = onRequest(async (req, res) => {
  const cors = (await import('cors'))({ origin: true });

  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json(
        { status: 405,
          message: 'Method not allowed',
        });
    }

    const vendorsRef = firestore.collection('vendors');
    const receiptsRef = firestore.collection('receipts');

    const apiKey = req.get('API-Key');
    const apiSecret = req.get('API-Secret');
    const nonce = req.get('Nonce');
    const hmacHexHeader = req.get('HMAC');
    const subtle = webcrypto.subtle;

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

      return res.status(400).json({
        status: 400,
        message: 'Missing headers \'API-Key\' and \'API-Secret\'',
      });
    }

    if (
      !hmacHexHeader ||
      !nonce ||
      typeof hmacHexHeader !== 'string' ||
      typeof nonce !== 'string' ||
      hmacHexHeader.length === 0 ||
      nonce.length === 0
    ) {
      logger.error(
        'onHttpReceiptSubmit:HttpsError',
        'invalid-argument',
        'Missing headers \'Nonce\' and \'HMAC\'',
        req.rawHeaders
      );

      return res.status(400).json({
        status: 400,
        message: 'Missing headers \'Nonce\' and \'HMAC\'',
      });
    }
    const encoder = new TextEncoder();
    const encodedApiSecret = encoder.encode(apiSecret);
    const hmacKey = await subtle.importKey(
      'raw',
      encodedApiSecret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const encodedNonce = encoder.encode(nonce);
    const signatureIntArray = Uint8Array.from(
      Buffer.from(
        hmacHexHeader,
        'hex'
      )
    );
    const validHmac = await subtle.verify(
      'HMAC',
      hmacKey,
      signatureIntArray,
      encodedNonce
    );

    if (!validHmac) {
      logger.error(
        'onHttpReceiptSubmit:HttpsError',
        'invalid-argument',
        'Cannot be trusted, invalid HMAC calculated',
      );

      return res.status(400).json({
        status: 400,
        message: 'Cannot be trusted, invalid HMAC calculated',
      });
    }

    const data = req.body;
    const branchId = data.branchId;
    const vendorId = data.vendor['vendorId'];


    if (
      !branchId ||
      !vendorId ||
      typeof branchId !== 'string' ||
      typeof vendorId !== 'string' ||
      branchId.length === 0 ||
      vendorId.length === 0
    ) {
      logger.error(
        'onHttpReceiptSubmit:HttpsError',
        'invalid-argument',
        'Missing body \'branchId\', \'vendorId\'',
        req.rawHeaders
      );

      return res.status(400).json({
        status: 400,
        message: 'Missing body \'branchId\', \'vendorId\'',
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
      return res
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
      userUid: null,
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
    } satisfies Receipt;

    try {
      await receiptDoc.set(receiptData, { merge: true });
      return res.status(200).json({ status: 200, message: receiptDoc.id });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ status: 500, message: 'Internal server error ' });
    }
  });
});
