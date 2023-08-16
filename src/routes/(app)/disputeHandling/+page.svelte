<script>
  import { firestore } from '$lib/firebase';
  import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
  } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores';
  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
  } from 'firebase/storage';
  import { goto } from '$app/navigation';
  import dayjs from 'dayjs';
  import {getHttpsCallable} from '$lib/firebase/functions'

  let receipts = [];
  let UserUid = $authStore?.uid;
  let userEmail = $authStore?.email;
  const receiptsRef = collection(firestore, 'receipts');
  const users = collection(firestore, 'users');
  let date = '';
  let time = '';
  let filename = '';
  let userType = '';

  if (!$authStore) {
    userType = 'invalid';
  }

  if (userType === 'invalid') {
    goto('/account/signin');
  } else if ($authStore && $authStore.tenantId) {
    userType = 'vendor';
    goto('/');
  }

  const q = query(receiptsRef, where('userUid', '==', UserUid));

  (async () => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      receipts.push({ ...doc.data(), id: doc.id });
    });
    console.log(querySnapshot.docs.map((d) => d.data()));
    filterReceipts();
  })();

  let year = '';
  let month = '';
  let searchQuery = '';
  let filteredReceipts = receipts;
  let evidence = null;
  let disputeType = '';
  let description = '';
  let selectedReceipt = null;
  let errorMessage = '';

  const itemsPerPage = 6;
  let currentPage = 1;
  let displayedReceipts = [];

  function filterReceipts() {
    filteredReceipts = receipts.filter((receipt) => {
      // Convert createdAt timestamp to a Day.js object
      const createdAtDate = dayjs(receipt.createdAt.toMillis());

      // Format date and time for display
      date = createdAtDate.format('YYYY/MM/DD'); // Convert createdAt to YYYY/MM/DD format
      time = createdAtDate.format('hh:mm');

      const receiptYear = date.substring(0, 4); // Use the converted date
      const receiptMonth = date.substring(5, 7);

      const yearMatch = year === '' || receiptYear === year;
      const monthMatch = month === '' || receiptMonth === month;
      const vendorMatch = receipt.vendor.vendorName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return yearMatch && monthMatch && vendorMatch;
    });

    currentPage = 1;
    updateDisplayedReceipts();
  }

  function handleFileInput(event) {
    const file = event.target.files[0];
    filename = file.name
    // Check the file type
    const validFileTypes = ['image/jpeg', 'application/pdf'];
    if (!validFileTypes.includes(file.type)) {
        errorMessage = 'Invalid file type. Only .jpg and .pdf files are allowed.';
        return; 
    } else {
        errorMessage = ''; 
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        evidence = reader.result; 
    };
    reader.readAsArrayBuffer(file);
}



  function handleDescriptionInput(event) {
    description = event.target.value;
  }

  function handleDisputeTypeChange(event) {
    disputeType = event.target.value;
  }

  function goToPage(page) {
    currentPage = page;
    updateDisplayedReceipts();
  }

  function updateDisplayedReceipts() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    displayedReceipts = filteredReceipts.slice(startIndex, endIndex);
  }

  updateDisplayedReceipts();

  let showConfirmation = false;

  function openConfirmation() {
    showConfirmation = true;
  }

  function closeConfirmation() {
    showConfirmation = false;
  }
  async function submitDispute() {
  try {

    const onValidateFileCallable = getHttpsCallable('validateFileCallable')
  
    const validationResponsePromise = onValidateFileCallable({ fileName : filename });
    const validationResponse = await validationResponsePromise;

    const validationData = validationResponse.data 

    if (!validationData) {
      throw new Error('Invalid file type. Only .jpg and .pdf files are allowed.');
    }

    const storage = getStorage();
    const storageRef = ref(storage, 'evidence/' + selectedReceipt.receiptId);

    const uploadTask = uploadBytesResumable(storageRef, evidence);

    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          console.log('Upload is done!');
          resolve();
        }
      );
    });

    const downloadURL = await getDownloadURL(storageRef);


    const disputeData = {
      vendorId: selectedReceipt.vendor.vendorId,
      userEmail: userEmail,
      receiptId: selectedReceipt.receiptId,
      description: description,
      disputeType: disputeType,
      evidenceUrl: downloadURL,
    };

    const docRef = await addDoc(
      collection(firestore, 'disputes'),
      disputeData
    );

    console.log('Dispute submitted with ID: ', docRef.id);
    closeConfirmation();
  } catch (e) {
    console.error('Error:', e);
    errorMessage = e.message || 'An error occurred while submitting the dispute.';
  }
}

  onMount(() => {
    closeConfirmation();
  });
</script>

<svelte:head>
  <title>disputeHandling</title>
</svelte:head>


{#if showConfirmation}
  <div
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-xl">
      <h3 class="text-lg font-semibold mb-4">Confirmation</h3>
      <p class="mb-6">Are you sure you want to submit the dispute?</p>
      <div class="flex justify-end">
        <button
          class="mr-2 px-4 py-2 text-white bg-emerald-500 rounded hover: bg-emerald-400"
          on:click={submitDispute}>
          Submit
        </button>
        <button
          class="px-4 py-2 text-gray-500 rounded hover:bg-red-200"
          on:click={closeConfirmation}>
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}

<div class="max-w-2xl mx-auto mb-40">
  <div class="grid grid-cols-2 mb-4 gap-4">
    <div>
      <label class="block font-medium mb-2">Year</label>
      <select
        class="w-full block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
        bind:value={year}
        on:change={filterReceipts}>
        <option value="">All</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
        <option value="2019">2019</option>
        <option value="2018">2018</option>
        <option value="2017">2017</option>
        <option value="2016">2016</option>
        <option value="2015">2015</option>
        <option value="2014">2014</option>
        <option value="2013">2013</option>
      </select>
    </div>
    <div>
      <label class="block font-medium mb-2">Month</label>
      <select
        class="w-full block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
        bind:value={month}
        on:change={filterReceipts}>
        <option value="">All</option>
        <option value="01">January</option>
        <option value="02">Febuary</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
    </div>
  </div>

  <div class="mb-8">
    <label class="block font-medium mb-2">Search Receipt:</label>
    <input
      type="text"
      class="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
      placeholder="Search by vendor"
      bind:value={searchQuery}
      on:input={filterReceipts} />
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    {#each displayedReceipts as receipt}
      <div
        class="border border-gray-300 p-4 rounded cursor-pointer hover:bg-gray-100"
        key={receipt.id}
        class:bg-blue-200={selectedReceipt === receipt}
        on:click={() => (selectedReceipt = receipt)}>
        <div class="text-lg font-medium mb-2">{receipt.vendor.vendorName}</div>
        <div class="text-sm text-gray-500 mb-1">Date: {date}</div>
        <div class="text-sm text-gray-500 mb-1">Time: {time}</div>
        <div class="text-sm text-gray-500">Total Cost: ${receipt.subtotal}</div>
      </div>
    {/each}
  </div>

  <div class="flex items-center justify-between mt-8">
    <div class="text-sm text-gray-600">
      Showing {currentPage} of {Math.ceil(
        filteredReceipts.length / itemsPerPage
      )} pages
    </div>

    {#if Math.ceil(filteredReceipts.length / itemsPerPage) > 1}
      <nav>
        <ul class="flex items-center">
          {#if currentPage > 1}
            <li>
              <button
                type="button"
                class="px-3 py-1 text-green-500 hover:text-green-700"
                on:click={() => goToPage(currentPage - 1)}>
                Prev
              </button>
            </li>
          {/if}

          {#each Array(Math.ceil(filteredReceipts.length / itemsPerPage)).fill() as _, i}
            <li>
              <button
                type="button"
                class="px-3 py-1 ml-2 text-green-500 hover:text-green-700"
                class:font-bold={i + 1 === currentPage}
                class:bg-green-200={i + 1 === currentPage}
                on:click={() => goToPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          {/each}

          <li>
            {#if currentPage < filteredReceipts.length / itemsPerPage}
              <button
                type="button"
                class="px-3 py-1 ml-2 text-green-500 hover:text-green-700"
                class:opacity-50={currentPage ===
                  Math.ceil(filteredReceipts.length / itemsPerPage)}
                on:click={() => goToPage(currentPage + 1)}>
                Next
              </button>
            {/if}
          </li>
        </ul>
      </nav>
    {/if}
  </div>

  <div class="mb-8">
    <label class="block font-medium mb-2">Dispute Type:</label>
    <select
      class="block w-full p-3 border border-gray-300 rounded"
      bind:value={disputeType}
      on:change={() => handleDisputeTypeChange(event)}>
      <option value="Damaged Item">Damaged Item</option>
      <option value="Incorrect Product">Incorrect Product</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div class="mb-8">
    <label class="block font-medium mb-2">Description:</label>
    <textarea
      class="block w-full p-3 border border-gray-300 rounded"
      rows="4"
      bind:value={description}
      on:input={handleDescriptionInput} />
  </div>

  <div class="mb-8">
    <label class="block font-medium mb-2">Evidence:</label>
    <input
      type="file"
      class="block"
      accept="image/*, .pdf"
      on:change={handleFileInput} />
      {#if errorMessage} 
        <p class="text-red-500 mt-2">{errorMessage}</p>
    {/if}
  </div>

  <div>
    {#if !errorMessage}
    <button
      type="button"
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-emerald-600"
      disabled={!selectedReceipt || !disputeType || !description || !evidence}
      on:click={openConfirmation}>
      Submit Dispute
    </button>
    {/if}
  </div>
</div>
