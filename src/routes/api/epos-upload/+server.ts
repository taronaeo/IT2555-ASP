import type { RequestEvent } from './$types';
import { json, error } from '@sveltejs/kit';
import { firestore } from '$lib/firebase';
import { collection, query, where, getDocs, setDoc, doc, FieldValue, serverTimestamp } from 'firebase/firestore';

import type { Receipt } from '$lib/models/receipt';



export const POST = async ({ request }: RequestEvent) => {
  const vendorRef = collection(firestore, 'vendors');


  const headers = request.headers;
  const api_key = headers.get('api_key');
  const api_secret = headers.get('api_secret');
  const data = await request.json();
  const userUid = data.userUid;
  const branchId = data.branchId;
  const vendorId = data.vendor['vendorId'];

  console.log(branchId)
  console.log(api_key)
  console.log(api_secret)
  const q = query(
    vendorRef,
    where('vendorId', '==', vendorId),
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

  const vendorName = data.vendor['vendorName'];
  const postalCode = data.branchPostal;

  const items = data.items;
  const subtotal = data.subtotal;
  const gst = data.gst;
  const total = data.total;
  const change = data.change;
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
    createdAt: serverTimestamp(),
    paymentMethod: paymentMethod
  } satisfies Receipt);
  return json(data);
}

// export const POST = async ({ request }) => {
//     const body =  await request.json()
//     console.log(body)
//     return new Response(JSON.stringify({message:"Successful"}),{status:201})
// }
