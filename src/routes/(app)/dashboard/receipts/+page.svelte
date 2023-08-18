<script lang="ts">
  import { onMount } from 'svelte';
  import { firestore } from '$lib/firebase';
  import {
    collection,
    getDocs,
    query,
    limit,
    orderBy,
    startAfter,
    endBefore,
    where,
  } from 'firebase/firestore';
  import dayjs from 'dayjs';
  import type { Receipt } from '$lib/models';
  import { authStore } from '$lib/stores';
  import type { Query, DocumentData } from 'firebase/firestore';
  import { writable } from 'svelte/store';

  let lastDoc: any;
  let receipts: Receipt[] = [];
  let firstDoc: any;
  let filterType: string | null = null;
  let selectedVendorId: string | null = null;
  let chronologicalOrder: 'desc' | 'asc' = 'desc'; // default to 'desc' (newest to oldest)

  const userUid: string = $authStore!.uid;

  const showFilters = writable(false);

  const showDateInput = writable(false);

  let selectedValue: 'asc' | 'desc' = 'desc';

  const ref = collection(firestore, 'receipts');

  function toggleDateInput() {
    showDateInput.update((value) => !value);
  }

  function toggleFilters() {
    showFilters.update((value) => !value);
  }

  function filterByChronological(type: string) {
    filterType = type;
    loadReceipts();
  }

  function filterByAmount(type: string) {
    filterType = type;
    loadReceipts();
  }

  function dateConversion(receipt: Receipt) {
    const createdAt = receipt.createdAt;
    // @ts-ignore
    const createdAtDate = createdAt.toMillis();
    const formattedDate = dayjs(createdAtDate).format('YYYY/MM/DD');
    const formattedTime = dayjs(createdAtDate).format('hh:mm');
    return `${formattedDate} ${formattedTime}`;
  }

  onMount(() => {
    loadReceipts();
  });

  onMount(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        !event
          .composedPath()
          .includes(document.getElementById('filterDropdown') as Node)
      ) {
        showFilters.set(false);
      }
    }

    document.body.addEventListener('click', handleOutsideClick);

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  });

  // function to get initial set of documents
  async function loadReceipts(selectedDate?: string) {
    console.log(selectedVendorId);
    let baseQuery: Query<DocumentData> = ref;
    let q: Query<DocumentData> | undefined;
    switch (filterType) {
      case 'chronological':
        q = query(
          baseQuery,
          where('userUid', '==', userUid),
          orderBy('createdAt', selectedValue),
          ...(firstDoc ? [endBefore(firstDoc)] : []),
          ...(lastDoc ? [startAfter(lastDoc)] : []),
          limit(5)
        );
        break;
      case 'amount':
        q = query(
          baseQuery,
          where('userUid', '==', userUid),
          orderBy('total', selectedValue),
          ...(firstDoc ? [endBefore(firstDoc)] : []),
          ...(lastDoc ? [startAfter(lastDoc)] : []),
          limit(5)
        );
        break;
      case 'vendor':
        q = query(
          baseQuery,
          where('userUid', '==', userUid),
          where('vendor.vendorId', '==', selectedVendorId),
          ...(firstDoc ? [endBefore(firstDoc)] : []),
          ...(lastDoc ? [startAfter(lastDoc)] : []),
          limit(5)
        );
        break;
      default:
        q = query(
          baseQuery,
          where('userUid', '==', userUid),
          orderBy('createdAt', 'desc'),
          ...(firstDoc ? [endBefore(firstDoc)] : []),
          ...(lastDoc ? [startAfter(lastDoc)] : []),
          limit(5)
        );
        break;
    }
    if (q) {
      try {
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;
        const data = docs.map((doc) => doc.data() as Receipt);

        firstDoc = docs[0];
        if (!firstDoc) {
          return;
        }
        lastDoc = docs[docs.length - 1];
        console.log(lastDoc);
        receipts = data;
      } catch (error) {
        console.error('Error fetching receipts:', error);
      }
    }
  }
  async function paginateNext() {
    firstDoc = null;
    await loadReceipts();
  }

  async function paginateBack() {
    lastDoc = null;
    await loadReceipts();
  }
</script>

<svelte:head>
  <title>Dashboard ∙ Receipts | Dr. Receipts</title>
</svelte:head>

<div class="mb-10">
  <h1 class="text-3xl font-bold">Receipts</h1>
</div>

<div class="inline-flex relative pb-4">
  <ul class="flex flex-wrap px-3 py-1 bg-emerald-600 rounded-md text-base">
    <li
      class="relative mx-1 px-1 py-2 bg-emerald-600 rounded-full mb-1 md:mb-0">
      <button
        class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-md focus:outline-none"
        on:click|stopPropagation={toggleFilters}>Filter By</button>
      {#if $showFilters}
        <ul
          id="filterDropdown"
          class="absolute top-0 left-0 mt-10 p-2 rounded-lg shadow-lg bg-white z-10">
          <li
            class="p-1 whitespace-no-wrap rounded-full text-sm md:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100">
            <button
              class="px-2 py-1 text-left"
              on:click={() => filterByChronological('chronological')}>
              <span class="">Chronological</span>
              <!-- Dropdown for the chronological order -->
              <select
                on:change={() => {
                  firstDoc = null;
                  lastDoc = null;
                }}
                bind:value={selectedValue}>
                <option value="desc">Sort from newest - oldest</option>
                <option value="asc">Sort from oldest - newest</option>
              </select>
            </button>
          </li>
          <li
            class="p-1 whitespace-no-wrap rounded-full text-sm md:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100">
            <button
              class="px-2 py-1 text-left"
              on:click={() => filterByAmount('amount')}>
              <span class="">Amount</span>
              <!-- Dropdown for the amount order -->
              <select
                on:change={() => {
                  firstDoc = null;
                  lastDoc = null;
                }}
                bind:value={selectedValue}>
                <option value="desc">Sort by highest amount</option>
                <option value="asc">Sort by lowest amount</option>
              </select>
            </button>
          </li>
        </ul>
      {/if}
    </li>
  </ul>
</div>

<div class="mx-auto font-bold text-2xl py-4">
  <h1>Transactions</h1>
</div>

<ul>
  {#each receipts as receipt}
    <a href={`/receipt/${receipt.receiptId}`}>
      <div class="container mx-auto font-thin text-">
        {dateConversion(receipt)}
        <li class="flex justify-between gap-x-6 py-5">
          <div class="flex gap-x-4">
            <img
              class="h-12 w-12 flex-none rounded-full bg-gray-50"
              src="../favicon.ico"
              alt="" />
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-emerald-600"
                >{receipt.vendor['vendorName']}</p>
              <p class="mt-1 truncate text-xs leading-5 text-gray-500"
                >{receipt.paymentMethod}</p>
            </div>
          </div>
          <div
            class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center">
            <p class="text-sm leading-6 text-emerald-600"
              >R ID: {receipt.receiptId}</p>
            <p class="text-sm leading-6 text-emerald-600"
              >Amt: ${receipt.total}</p>
          </div>
        </li>
      </div></a>
  {/each}
</ul>

<button
  class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-md focus:outline-none"
  on:click={paginateBack}>Previous Page</button>
<button
  class="float-right py-2 px-4 bg-emerald-600 text-white font-bold rounded-md focus:outline-none"
  on:click={paginateNext}>Next Page</button>

<div class="flex flex-col items-center justify-center text-gray-400 pt-10">
  <p>want to add your own receipts? click here for </p>
  <p>
    <a
      href="/manual-receipt-input"
      class="underline transition hover:text-emerald-600">
      manual receipt input
    </a>
  </p>
</div>
