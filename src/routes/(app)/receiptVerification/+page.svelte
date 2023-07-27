<script>
  // Move the import statements inside the script tags
  import { firestore } from '$lib/firebase';
  import { collection, query, where, getDocs } from 'firebase/firestore';

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
    } else if (isNaN(Number(fields.receiptID.trim())) || fields.receiptID.trim() === '') {
      valid = false;
      errors.receiptID = 'Receipt ID can only contain numbers';
    } else if (fields.receiptID.length != 19) {
      valid = false;
      errors.receiptID = 'Receipt ID should be 19 numbers in length';
    }

    // Validation for Total
    const totalValue = Number(fields.Total.trim());
    if (fields.Total.trim().length < 1) {
      valid = false;
      errors.Total = 'Total cannot be empty';
    } else if (totalValue <= 0 || isNaN(totalValue)) {
      valid = false;
      errors.Total = 'Total must be a positive number';
    }
  };

  // Ensure receiptId and totalPrice are defined before using them in the query
  let receiptId = 'your_receipt_id_value';
  let totalPrice = 100; // replace with your actual total price value

  const receiptsRef = collection(firestore, 'receipts');
  const q = query(
    receiptsRef,
    where('receiptId', '==', receiptId),
    where('total', '==', totalPrice)
  );

  (async () => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data()));
  })();

  const submitHandler = () => {
    validateForm();
    if (valid) {
      console.log('Valid form:', fields);
    } else {
      console.log('Invalid form:', errors);
    }
  };
</script>

  
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
          type="text"
        />
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
          type="text"
        />
        <div class="error font-bold text-red-600">{errors.Total}</div>
      </div>

      <div class="pt-5 mb-8">
        <button
          type="submit"
          class="h-10 w-full rounded-lg text-white text-center font-medium bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Verify
        </button>
      </div>
    </form>
  </div>
  
  
  
  
  
  
  
  <!--receipt-->
  {#if valid}
  <div class=" m-auto w-2/5 bg-white py-4 pt-20 shadow-xl">
    <div class="text-center"> <!--Div for header-->
        <div class='text-2xl font-bold my-2'><img class="h-20 inline text-center" src="fairprice.svg" alt='logo'></div>
        <div class='text-md font-light'>33A Orchard Road, #03-13, Mandarin Gallery</div>
        <div class='text-md font-light'>Singapore 123123</div>
        <div class="text-left text-lg font-bold ml-6">Receipt ID: <span>939203</span></div>
        <div class=""><hr class="border-t-2 border-black border-dashed mb-2 mx-6"></div>
    </div> 
    <div class="leading-7 grid grid-cols-6 mx-6 font-light">
        <div class="col-span-5">Push Up Bar 500 Blue</div>
        <div class="col-span-1 text-right">$23.00</div>

        <div class="col-span-5">Push Up Bar 500 Blue</div>
        <div class="col-span-1 text-right">$23.00</div>

        <div class="col-span-5">Warayaki Aburi Salmon Don</div>
        <div class="col-span-1 text-right">$8.90</div>

        <div class="col-span-5">Upsize Rice</div>
        <div class="col-span-1 text-right">$8.90</div>

        <div class="col-span-5">Yuzu Cola</div>
        <div class="col-span-1 text-right">$3.00</div>

        <div class="col-span-5">Yuzu Cola</div>
        <div class="col-span-1 text-right">$3.00</div>

        <div class="col-span-5">Mazda Rx7</div>
        <div class="col-span-1 text-right">$0.00</div>

    </div>
    <div class=""><hr class="border-t-2 border-black border-dashed mb-2 mx-6"></div>
    <div class="grid grid-cols-6"> <!--receipt Totals div-->
        
        <div class="col-span-4 mx-6 font-semibold">SUBTOTAL</div>
        <div class="col-span-2 mx-6 text-right">$99990.99</div>

        <div class="col-span-4 mx-6 font-semibold">GST <span class="font-thin">(8%)</span></div>
        <div class="col-span-2 mx-6 text-right">$9.01</div>

        <div class="col-span-4 mx-6 font-semibold">TOTAL</div>
        <div class="col-span-2 mx-6 text-right">$100000.00</div>

        <div class="col-span-4 mx-6 font-semibold">VISA Ending in 2030</div>
        <div class="col-span-2 mx-6 text-right">$100000.00</div>

        <div class="col-span-4 mx-6 font-semibold">CHANGE</div>
        <div class="col-span-2 mx-6 text-right">$0.00</div>

        
                
    </div>
    
    <div class=""><hr class="border-t-2 border-black border-dashed my-2 mx-6"></div>
    <div class="mx-6 grid grid-cols-6"> <!--footer div-->
        <div class="text-center col-span-6"><span>2021/12/25</span> <span>15:30</span></div>
    </div>

</div>
    {/if}
</div>



