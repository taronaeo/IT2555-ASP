<script lang="ts">
  interface Item {
    item_name: string;
    item_price: number;
  }

  interface Receipt {
    receipt_id: string;
    vendor_id: string;
    vendor_loc: string;
    items: Item[];
    subtotal: number;
    gst: number;
    total: number;
    created_at: FieldValue;
  }

  // Step 1: Import required modules
  import { firestore } from '$lib/firebase'
  import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy, FieldValue } from 'firebase/firestore'

  const ref = collection(firestore, 'receipts');
  let receipts: Receipt[] = [];

  // Step 2: Create a function to create the document
  function addDocument() {
    const data = {
      receipt_id: 'GEGAEGAGAE',
      vendor_id: 'GEGAY$W@#RTY%TREWSA',
      vendor_loc: '33A Orchard Road, #03-13, Mandarin Gallery Singapore 123123',
      items: [
        { item_name: 'Push Up Bar 500 Blue', item_price: 99.00 },
        { item_name: 'Warayaki Aburi Salmon Don', item_price: 8.90 },
      ],
      subtotal: 99990.99,
      gst: 9.01,
      total: 100000.00,
      created_at: serverTimestamp(),
    } satisfies Receipt

    addDoc(ref, data).then(console.log).catch(console.error);
  }

  // Step 3: Add a real-time collection listener to look for new data
  const q = query(ref, orderBy('created_at', 'asc'))
  const unsubscribe = onSnapshot(q, (snap) => {
    receipts = snap.docs.map(d => d.data() as Receipt);
  });
</script>

<h1>Aaron's page</h1>

<button
  on:click={addDocument}
  type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
  Create document
</button>

{#each receipts as receipt}
  <h1 class="text-4xl">{receipt.vendor_id}</h1>
  <p>Created at {receipt.created_at}</p>
{/each}
