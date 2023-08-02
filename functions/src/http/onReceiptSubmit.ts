import * as logger from 'firebase-functions/logger';

import { firestore } from '../firebase';
import { onRequest } from 'firebase-functions/v2/https';
import { FieldValue } from '../models';

export const onReceiptSubmit = onRequest(
  {
    cors: ['localhost', 'it2555-asp.web.app'],
  },
  async (req, res) => {
    type Vendor = {
      vendorId: string;
      vendorName: string;
      vendorLocation: string;
      postalCode: number;
    };

    type Items = {
      itemName: string;
      price: number;
      discount: string | null;
      remarks: string | null;
    };

    type Receipt = {
      receiptId?: string;
      vendor: Vendor;
      userUid: string;
      items: Items[];
      subtotal: number;
      gst: number;
      total: number;
      change: number;
      paymentMethod: string;
      createdAt: FieldValue;
    };

    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set(
        'Access-Control-Allow-Headers',
        'Content-Type, api_key, api_secret'
      );
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send({});
    }

    if (req.method !== 'POST') {
      res.status(405).send({ status: 405, message: 'Method not allowed' });
    }

    const receiptRef = firestore.collection('receipts');
    const vendorRef = firestore.collection('vendors');

    const headers = req.headers;
    const apiKey = headers['api_key'];
    const apiSecret = headers['api_secret'];
    logger.log(headers);
    if (!apiKey || !apiSecret) {
      logger.error('No Key or Secret Provided');
      res.status(403).send('Invalid Api Key or Secret');
      return;
    }

    const data = req.body;
    const userUid = data.userUid;
    const branchId = data.branchId;
    const vendorId = data.vendor['vendorId'];

    const q = vendorRef
      .where('vendorId', '==', vendorId)
      .where('apiKeys', 'array-contains', {
        branchId: branchId,
        key: apiKey,
        secret: apiSecret,
      });

    const querySnapshot = await q.get();
    if (querySnapshot.docs.length === 0) {
      logger.error('Invalid Api Key or Secret');
      res.status(403).send('Invalid Api Key or Secret');
      return;
    }

    querySnapshot.forEach((doc) => {
      console.log('Data: ', doc.data());
    });

    const vendorLocation = data.branchLocation;
    const vendorName = data.vendor['vendorName'];
    const postalCode = data.branchPostal;

    const items = data.items;
    const subtotal = data.subtotal;
    const gst = data.gst;
    const total = data.total;
    const change = data.change;
    const paymentMethod = data.paymentMethod;

    const RECEIPT_DATA: Receipt = {
      vendor: {
        vendorId: vendorId,
        vendorName: vendorName,
        vendorLocation: vendorLocation,
        postalCode: postalCode,
      },
      userUid: userUid,
      items: items,
      subtotal: subtotal,
      gst: gst,
      total: total,
      change: change,
      paymentMethod: paymentMethod,
      createdAt: FieldValue.serverTimestamp(),
    };

    const newDocRef = receiptRef.doc();
    RECEIPT_DATA.receiptId = newDocRef.id;

    try {
      await firestore
        .collection('receipts')
        .doc(newDocRef.id)
        .set(RECEIPT_DATA);
      logger.log('Sending Receipt ID:');
      res.status(200).send(newDocRef.id);
    } catch (error) {
      logger.error('Failed to submit receipt data to firestore', error);
      res.status(500).send('Unsuccessful');
    }
  }
);
