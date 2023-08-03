<script>
  // Move the import statements inside the script tags
  import { firestore } from '$lib/firebase';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { ref, getStorage, getDownloadURL } from 'firebase/storage';

  // Move the variable declarations above the validation logic
  let fields = { receiptID: '', Total: '' };
  let errors = { receiptID: '', Total: '' };
  let valid = false;

  // Validation function
  const validateForm = () => {
    valid = true;
    errors = { receiptID: '', Total: '' };

    // Validation for receiptID
    if (fields.receiptID.trim().length < 1) {
      valid = false;
      errors.receiptID = 'Receipt ID cannot be empty.';
    } else if (fields.receiptID.length != 20) {
      valid = false;
      errors.receiptID = 'Invalid Receipt ID';
    }

    // Validation for Total
    const totalValue = Number(fields.Total.trim());
    if (fields.Total.trim().length < 1) {
      valid = false;
      errors.Total = 'Invalid Total';
    } else if (totalValue <= 0 || isNaN(totalValue)) {
      valid = false;
      errors.Total = 'Invalid Total';
    }
  };

  let receiptId = '';
  let totalPrice = null;
  let receiptData = null;
  let logoSrc = '';

  
const submitHandler = async () => {
  validateForm();
  if (valid) {
    receiptId = fields.receiptID;
    totalPrice = Number(fields.Total);
    console.log('Valid form');
    const receiptsRef = collection(firestore, 'receipts');
    const q = query(
      receiptsRef,
      where('receiptId', '==', receiptId),
      where('total', '==', totalPrice)
    );

    try {
      const querySnapshot = await getDocs(q);

      // Check if there are any documents returned
      if (querySnapshot.size > 0) {
        // Assuming you only expect one document to match the query, you can access the first one
        const doc = querySnapshot.docs[0];
        receiptData = doc.data(); // Store the receipt data in the variable

        const fileSnap = await getDownloadURL(
          ref(getStorage(), `VendorLogos/${receiptData.vendor.vendorId}.svg`)
        );
        logoSrc = fileSnap;
      } else {
        console.log('No matching receipt found.');
        // Handle the case where no receipt is found
        // For example, you can show an error message to the user
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
      // Handle any errors that may occur during fetching
      // For example, you can show an error message to the user
    }
  } else {
    console.log('Invalid form');
  }
};
</script>

<svelte:head>
  <title>ReceiptVerification</title>
</svelte:head>

<div class="h-screen flex flex-col items-center">
  <div class="mt-10 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
    <h1 class="text-4xl text-center">Receipt Verification</h1>
  </div>

  <div class="mt-10 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
    <form on:submit|preventDefault={submitHandler}>
      <div class="mb-5">
        <label class="font-light" for="receiptID">Receipt ID: </label>
        <input
          placeholder="Enter receipt id"
          class="p-2.5 w-full block rounded-lg font-light text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
          bind:value={fields.receiptID}
          id="receiptID"
          name="receiptID"
          type="text" />
        <div class="error font-bold text-red-600">{errors.receiptID}</div>
      </div>

      <div class="mb-5">
        <label class="font-light" for="Total">Total: </label>
        <input
          placeholder="Enter total"
          class="p-2.5 w-full block rounded-lg font-light text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
          bind:value={fields.Total}
          id="Total"
          name="Total"
          type="text" />
        <div class="error font-bold text-red-600">{errors.Total}</div>
      </div>

      <div class="pt-5 mb-8">
        <button
          type="submit"
          class="h-10 w-full rounded-lg text-white text-center font-medium bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300">
          Verify
        </button>
      </div>
    </form>
  </div>

  <!--receipt-->


  {#if valid && receiptData}
    <div class="m-auto w-full bg-white py-4 pt-20 shadow-xl">
      <div class="text-center">
        <div class="text-2xl font-bold my-2">
          <img
            class="h-20 inline text-center"
            src={logoSrc}
            alt="logo"
          />
        </div>
        <div class="text-md font-light">
          {receiptData.vendor.vendorLocation}
        </div>
        <div class="text-md font-light">
          {receiptData.vendor.postalCode}
        </div>
        <div class="text-left text-lg font-bold ml-6">
          Receipt ID: <span>{receiptData.receiptId}</span>
        </div>
        <div class="">
          <hr class="border-t-2 border-black border-dashed mb-2 mx-6" />
        </div>
      </div>
      <div class="leading-7 grid grid-cols-6 mx-6 font-light">
        {#each receiptData.items as item}
          <div class="col-span-5">{item.itemName}</div>
          <div class="col-span-1 text-right">${item.price.toFixed(2)}</div>
        {/each}
      </div>
      <div class="">
        <hr class="border-t-2 border-black border-dashed mb-2 mx-6" />
      </div>
      <div class="grid grid-cols-6">
        <div class="col-span-4 mx-6 font-semibold">SUBTOTAL</div>
        <div class="col-span-2 mx-6 text-right">
          ${receiptData.subtotal.toFixed(2)}
        </div>

        <div class="col-span-4 mx-6 font-semibold">
          GST <span class="font-thin">(8%)</span>
        </div>
        <div class="col-span-2 mx-6 text-right">
          ${(receiptData.subtotal * 0.08).toFixed(2)}
        </div>

        <div class="col-span-4 mx-6 font-semibold">TOTAL</div>
        <div class="col-span-2 mx-6 text-right">
          ${(receiptData.total).toFixed(2)}
        </div>

        <div class="col-span-4 mx-6 font-semibold"> 
        {receiptData.paymentMethod}
        </div>
        <div class="col-span-2 mx-6 text-right">
          ${(receiptData.total).toFixed(2)}
        </div>

        <div class="col-span-4 mx-6 font-semibold">CHANGE</div>
        <div class="col-span-2 mx-6 text-right">{receiptData.change}</div>
      </div>
      <div class="">
        <hr class="border-t-2 border-black border-dashed my-2 mx-6" />
      </div>
      <div class="mx-6 grid grid-cols-6">
      </div>
    </div>
  {:else if valid}
  <div class="m-auto w-full bg-white p-8">
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4">No matching receipts found</h2>
      <p class="text-gray-600">Please check the receipt ID and total amount and try again.</p>
    </div>
  </div>
  {/if}
</div>

