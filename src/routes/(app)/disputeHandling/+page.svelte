<script>
  import { onMount } from 'svelte';
    let receipts = [
      { id: 1, vendor: 'NTUC', date: '2023-01-01', time: '09:30 AM', totalCost: '$50.00' },
      { id: 2, vendor: 'Cold Storage', date: '2022-02-02', time: '11:45 AM', totalCost: '$25.99' },
      { id: 3, vendor: '7/11', date: '2022-03-03', time: '02:15 PM', totalCost: '$15.00' },
      { id: 4, vendor: 'Toys R US', date: '2022-03-04', time: '10:00 AM', totalCost: '$75.50' },
      { id: 5, vendor: 'Mc Donalds', date: '2022-04-05', time: '04:30 PM', totalCost: '$12.99' },
      { id: 6, vendor: 'NTUC', date: '2023-01-06', time: '01:45 PM', totalCost: '$32.00' },
      { id: 7, vendor: 'KFC', date: '2023-05-07', time: '09:30 AM', totalCost: '$20.00' },
      { id: 8, vendor: 'Bread Talk', date: '2023-05-08', time: '12:15 PM', totalCost: '$10.99' },
      { id: 9, vendor: 'Burger King', date: '2023-9-09', time: '03:45 PM', totalCost: '$45.50' },
      { id: 10, vendor: 'Challenger', date: '2023-10-10', time: '09:30 AM', totalCost: '$65.99' },
      { id: 11, vendor: 'Cheers', date: '2023-11-11', time: '02:00 PM', totalCost: '$22.00' },
      { id: 12, vendor: 'Cotton On', date: '2023-12-12', time: '11:30 AM', totalCost: '$18.99' },
      { id: 13, vendor: 'uni qlo', date: '2023-7-12', time: '11:30 AM', totalCost: '$28.99' },
      { id: 14, vendor: 'Gucci', date: '2021-5-16', time: '11:30 AM', totalCost: '$49.99' },
      { id: 15, vendor: 'Rolex', date: '2021-5-27', time: '12:30 AM', totalCost: '19999.99' },
      { id: 16, vendor: 'Apple', date: '2021-5-13', time: '1:30 PM', totalCost: '$999.99' },
      { id: 17, vendor: 'Texas Chicken', date: '2023-5-12', time: '11:30 AM', totalCost: '$9.99' },
    ];
    let year = "" ;
    let month = "" ;
    let searchQuery = '';
    let filteredReceipts = receipts;
    let evidence = null;
    let disputeType = '';
    let description = '';
    let selectedReceipt = null;
  
    const itemsPerPage = 6;
    let currentPage = 1;
    let displayedReceipts = [];
  
    function filterReceipts() {
    filteredReceipts = receipts.filter(receipt => {
      const receiptYear = receipt.date.substring(0,4);
      const receiptMonth = receipt.date.substring(5,7);

      const yearMatch = year === "" || receiptYear === year;
      const monthMatch = month === "" || receiptMonth === month; 
      const vendorMatch = receipt.vendor.toLowerCase().includes(searchQuery.toLowerCase());

      return yearMatch && monthMatch && vendorMatch;
    });

    currentPage = 1;
    updateDisplayedReceipts();
  }
  
    function handleFileInput(event) {
      evidence = event.target.files[0];
    }
  
    function handleDescriptionInput(event) {
      description = event.target.value;
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

  function submitDispute() {
    closeConfirmation();
  }

  onMount(() => {
    closeConfirmation();
  });
  </script>
  
  {#if showConfirmation}
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-xl">
      <h3 class="text-lg font-semibold mb-4">Confirmation</h3>
      <p class="mb-6">Are you sure you want to submit the dispute?</p>
      <div class="flex justify-end">
        <button class="mr-2 px-4 py-2 text-white bg-emerald-500 rounded hover: bg-emerald-400" on:click={submitDispute}>
          Submit
        </button>
        <button class="px-4 py-2 text-gray-500 rounded hover:bg-red-200 "on:click={closeConfirmation}>
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
        <select class="w-full block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
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
        <select class="w-full block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
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
      <label class="block font-medium mb-2 ">Search Receipt:</label>
      <input
        type="text"
        class="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
        placeholder="Search by vendor"
        bind:value={searchQuery}
        on:input={filterReceipts}
      />
    </div>
  
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      {#each displayedReceipts as receipt}
        <div
          class="border border-gray-300 p-4 rounded cursor-pointer hover:bg-gray-100"
          key={receipt.id}
          class:bg-blue-200={selectedReceipt === receipt}
          on:click={() => selectedReceipt = receipt}
        >
          <div class="text-lg font-medium mb-2">{receipt.vendor}</div>
          <div class="text-sm text-gray-500 mb-1">Date: {receipt.date}</div>
          <div class="text-sm text-gray-500 mb-1">Time: {receipt.time}</div>
          <div class="text-sm text-gray-500">Total Cost: {receipt.totalCost}</div>
        </div>
      {/each}
    </div>
  
    <div class="flex items-center justify-between mt-8">
      <div class="text-sm text-gray-600">
        Showing {currentPage} of {Math.ceil(filteredReceipts.length / itemsPerPage)} pages
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
                  on:click={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            {/each}
  
            <li>
            {#if currentPage < (filteredReceipts.length / itemsPerPage)}
              <button
                type="button"
                class="px-3 py-1 ml-2 text-green-500 hover:text-green-700"
                class:opacity-50={currentPage === Math.ceil(filteredReceipts.length / itemsPerPage)}
                on:click={() => goToPage(currentPage + 1)}
              >
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
      <select class="block w-full p-3 border border-gray-300 rounded" bind:value={disputeType}>
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
        on:input={handleDescriptionInput}
      ></textarea>
    </div>
  
    <div class="mb-8">
      <label class="block font-medium mb-2">Evidence:</label>
      <input
        type="file"
        class="block"
        accept="image/*, .pdf"
        on:change={handleFileInput}
      />
    </div>
  
    <div>
      <button
        type="button"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-emerald-600"
        disabled={!selectedReceipt || !disputeType || !description || !evidence}
        on:click={openConfirmation}
      >
        Submit Dispute
      </button>
    </div>

</div>