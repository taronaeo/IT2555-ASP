import type { RequestEvent } from './$types';
import { json, error } from '@sveltejs/kit';
import { firestore } from '$lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

import type { Receipt } from '$lib/models/receipt'


export const POST = async ({ request }: RequestEvent) => {
  const userRef = collection(firestore, 'users');


  const headers = request.headers;
  const api_key = headers.get('api_key');
  const api_secret = headers.get('api_secret');
  const data = await request.json();
  const userUid = data.userUid;
  const branchId = data.branchId;
  const branchLocation = data.branchLocation;
  const branchPostal = data.branchPostal;


  const q = query(
    userRef,
    where('uid', '==', userUid),
    where('apiKeys', 'array-contains', {
      branchId: branchId,
      key: api_key,
      secret: api_secret
    })
  );


  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length===0){
    throw error(400, {
      message: 'Forbidden'
    })
  }

  const vendorLocation = data.branchLocation;
  const vendorId = data.vendor['vendorId'];
  const vendorName = data.vendor['vendorName'];
  const postalCode = data.branchPostal;

  const items = data.items;
  const subtotal = data.subtotal;
  const gst = data.gst;
  const total = data.total;
  const change = data.change;
  const time = data.time;
  const date = data.date;
  const paymentMethod = data.paymentMethod;

  const receiptRef = doc(collection(firestore, 'receipts'));

  await setDoc(receiptRef, {
    receiptId: receiptRef.id,
    vendor:{
      vendorId: vendorId,
      vendorName: vendorName,
      vendorLocation: vendorLocation,
      postalCode: postalCode
    },
    userUid: userUid,
    items:items,
    subtotal: subtotal,
    gst:gst,
    total: total,
    change: change,
    date: date,
    time: time,
    paymentMethod: paymentMethod
  } satisfies Receipt);
  return json(data);
}

// export const POST = async ({ request }) => {
//     const body =  await request.json()
//     console.log(body)
//     return new Response(JSON.stringify({message:"Successful"}),{status:201})
// }
