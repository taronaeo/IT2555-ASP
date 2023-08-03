<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte'
import {firestore} from '$lib/firebase'
import {collection, getDocs, query, limit, orderBy, startAfter, DocumentSnapshot, QueryDocumentSnapshot, startAt, Timestamp, refEqual, endBefore, doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs'
import type { Receipt } from '$lib/models';
import { authStore } from '$lib/stores';
import { AniIconLoading } from '$lib/icons';


let lastDoc: any;
let receipts: Receipt[] = [];
let firstDoc: any;

//to be corrected
const userUid: string = $authStore!.uid;

const ref = collection(firestore, 'receipts')

function filterByVendor(vendorId:string){

}

function dateConversion(receipt: Receipt) {
  const createdAt = receipt.createdAt;
  // @ts-ignore
  const createdAtDate = createdAt.toMillis();
  const formattedDate = dayjs(createdAtDate).format('YYYY/MM/DD');
  const formattedTime = dayjs(createdAtDate).format('hh:mm')
  return `${formattedDate} ${formattedTime}`

}

async function listVendorsBought(){
  const usersReceiptsVendorsRef = doc(firestore, 'usersReceiptsVendors', userUid );
  const docSnap = await getDoc(usersReceiptsVendorsRef)
  const data = docSnap.data();

  //@ts-ignore
  const vendorsBoughtFrom = data.vendorsBoughtFrom;
  const vendors = Object.keys(vendorsBoughtFrom)
  return vendors
}

onMount(() =>{
  loadReceipts();
})



// function to get initial set of documents
async function loadReceipts() {
  const q = query(ref, orderBy('createdAt', 'desc'), ...(firstDoc ? [endBefore(firstDoc)] : []), ...(lastDoc ? [startAfter(lastDoc)] : []), limit(5));

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const data = docs.map((doc) => doc.data() as Receipt);

  firstDoc = docs[0];
  lastDoc = docs[docs.length - 1];
  receipts = data;
}

async function paginateNext() {
  firstDoc = null;
  await loadReceipts();
}

async function paginateBack() {
  lastDoc = null;
  await loadReceipts();
}



$: console.log(lastDoc)


</script>

<svelte:head>
  <title>IT2555</title>
</svelte:head>

<div class="inline-flex relative pb-4">
  <ul class="flex flex-wrap px-3 py-1 bg-emerald-600 rounded-md text-base">
    <li
      class="relative mx-1 px-1 py-2 group bg-emerald-600 rounded-full mb-1 md:mb-0">
      <span
        class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-md focus:outline-none"
        >Filter By</span>
      <ul
        class="absolute top-0 left-0 mt-10 p-2 rounded-lg shadow-lg bg-white z-10 hidden group-hover:block">
        <li
          class="p-1 whitespace-no-wrap rounded-full text-sm md:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100">
          <a class="px-2 py-1" href="consolidations">
            <span class="">Chronological</span>
          </a>
        </li>
        <li
          class="p-1 whitespace-no-wrap rounded-full text-sm md:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100">
          <a class="px-2 py-1" href="consolidations">
            <span class="">Amount</span>
          </a>
        </li>
        <li
          class="p-1 whitespace-no-wrap rounded-full text-sm md:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100">
          <a class="px-2 py-1" href="consolidations">
            <span class="">Date</span>
          </a>
        </li>
      </ul>
    </li>
  </ul>
</div>

<div class="flex overflow-x-auto">
  {#await listVendorsBought() }
    <AniIconLoading fill="#059669"></AniIconLoading>
  {:then vendors}
  {#each vendors as vendor}
    <button
    on:click={()=>{filterByVendor(vendor)}}
    class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
      <div class="min-w-0 flex-auto">
        <img
          class="h-12 w-12 flex-none rounded-full bg-gray-50"
          src="fairprice logo .jpg"
          alt="" />
        <p class="text-sm font-semibold leading-6 text-emerald-600">{vendor}</p>
      </div>
    </button>
  {/each}
  {/await}

  <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
    <div class="min-w-0 flex-auto">
      <img
        class="h-12 w-12 flex-none rounded-full bg-gray-50"
        src="fairprice logo .jpg"
        alt="" />
      <p class="text-sm font-semibold leading-6 text-emerald-600">FairPrice</p>
    </div>
  </a>
  <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
    <div class="min-w-0 flex-auto">
      <img
        class="h-12 w-12 flex-none rounded-full bg-gray-50"
        src="koi the.jpg"
        alt="" />
      <p class="text-sm font-semibold leading-6 text-emerald-600">Koi The</p>
    </div>
  </a>
  <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
    <div class="min-w-0 flex-auto">
      <img
        class="h-12 w-12 flex-none rounded-full bg-gray-50"
        src="logo.svg"
        alt="" />
      <p class="text-sm font-semibold leading-6 text-emerald-600">SgCarWash</p>
    </div>
  </a>
  <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
    <div class="min-w-0 flex-auto">
      <img
        class="h-12 w-12 flex-none rounded-full bg-gray-50"
        src="haidilau logo.jpg"
        alt="" />
      <p class="text-sm font-semibold leading-6 text-emerald-600">haidilau</p>
    </div>
  </a>
  <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
    <div class="min-w-0 flex-auto">
      <img
        class="h-12 w-12 flex-none rounded-full bg-gray-50"
        src="caifan logo.jpg"
        alt="" />
      <p class="text-sm font-semibold leading-6 text-emerald-600"
        >Caifan Industries</p>
    </div>
  </a>
  <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
    <div class="min-w-0 flex-auto">
      <img
        class="h-12 w-12 flex-none rounded-full bg-gray-50"
        src="mickey mouse logo.jpg"
        alt="" />
      <p class="text-sm font-semibold leading-6 text-emerald-600"
        >Mickey Mouse CardHouse</p>
    </div>
  </a>
</div>

<div class="mx-auto font-bold text-2xl py-4">
  <h1>Transactions</h1>
</div>

<ul>
    {#each receipts as receipt}
    <a href="receipt">
      <div class="container mx-auto font-thin text-">
        {dateConversion(receipt)}
        <li class="flex justify-between gap-x-6 py-5">
          <div class="flex gap-x-4">
            <img
              class="h-12 w-12 flex-none rounded-full bg-gray-50"
              src="fairprice logo .jpg"
              alt="" />
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-emerald-600"
                >{receipt.vendor["vendorName"]}</p>
              <p class="mt-1 truncate text-xs leading-5 text-gray-500">{receipt.paymentMethod}</p>
            </div>
          </div>
          <div
            class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center">
            <p class="text-sm leading-6 text-emerald-600">R ID: {receipt.receiptId}</p>
            <p class="text-sm leading-6 text-emerald-600">Amt: ${receipt.total.toFixed(2)}</p>
          </div>
        </li>
      </div></a>
    {/each}
</ul>

<div>
  <button class= "px-4 py-2 bg-emerald-600 text-white font-bold rounded-md focus:outline-none"on:click={paginateBack}>Previous Page</button>
</div>

<div class="flex justify-end">
  <button class="py-2 px-4 bg-emerald-600 text-white font-bold rounded-md focus:outline-none flex justify-end" on:click={paginateNext}>Next Page</button>
</div>


