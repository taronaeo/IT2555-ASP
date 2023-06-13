<script lang='ts'>
  import { firestore } from '$lib/firebase'
  import { setDoc, addDoc, collection, onSnapshot, serverTimestamp, query, orderBy, FieldValue, limit, doc } from 'firebase/firestore'
  import type { Receipt } from '$lib/models/receipt'
  import { updateCurrentUser } from 'firebase/auth';
  import { authStore } from '$lib/stores';

  const ref = doc(collection(firestore, 'receipts'));
    
  let receipt:Receipt[] = [];

  function addDocument(){
    
    setDoc( ref, {
        receiptId: ref.id,
        vendor:{
            vendorId: "FairPriceNTUC",
            vendorName: "NTUC",
            vendorLocation: "33A Orchard Road, #03-13, Mandarin Gallery",
            postalCode: 123123
        },
        userUid: $authStore.uid,
        items:[
            {itemId:'123123', itemName:"Apple", price:12.00},
            {itemId:'234234', itemName:"Banana", price: 5.00}
        ],
        subtotal:12.00,
        gst:1.20,
        total: 13.20,
        date: "12/6",
        time: "2:10",
        paymentMethod: "Paynow",
        change: 0,

    } satisfies Receipt
    )

  }
  console.log($authStore.uid)
</script>

<button
    on:click={addDocument}
    class="m-20 px-6 py-2 rounded text-center border-2">Add receipt</button>