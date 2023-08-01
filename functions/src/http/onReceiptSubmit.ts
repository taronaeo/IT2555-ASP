import * as logger from 'firebase-functions/logger';

import { firestore } from '../firebase';
import { onRequest } from 'firebase-functions/v2/https';
import { FieldValue } from '../models';

export const onReceiptSubmit = onRequest(async (req, res) => {
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

  const userRef = firestore.collection('users');
  const receiptRef = firestore.collection('receipts');

  const headers = req.headers;
  const apiKey = headers['api_key'];
  const apiSecret = headers['api_secret'];

  if (!apiKey || !apiSecret) {
    res.send(403).send('Invalid Api Key or Secret');
    return;
  }

  const data = req.body;
  const userUid = data.userUid;
  const branchId = data.branchId;
  console.log(data);
  console.log(headers);


  const q = userRef
    .where('uid', '==', userUid)
    .where('apiKeys', 'array-contains', {
      branchId: branchId,
      key: apiKey,
      secret: apiSecret,
    });


  const querySnapshot = await q.get();
  if (querySnapshot.docs.length===0) {
    res.status(403).send('Invalid Api Key or Secret');
    return;
  }

  querySnapshot.forEach( (doc) =>{
    console.log('Data: ', doc.data());
  });

  const vendorLocation = data.branchLocation;
  const vendorId = data.vendor['vendorId'];
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
    await firestore.collection('receipts').doc(newDocRef.id).set(RECEIPT_DATA);
    logger.log(
      'Sending Receipt ID:'
    );
    res.status(200).send(newDocRef.id);
  } catch (error) {
    logger.error(
      'Failed to submit receipt data to firestore',
      error
    );
    res.status(500).send('Unsuccessful');
  }
});
