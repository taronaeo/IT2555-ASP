<script>
  import { firestore } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores';
  import { getStorage, ref, getDownloadURL } from 'firebase/storage';
  import dayjs from 'dayjs';
  import { getHttpsCallable } from '$lib/firebase/functions';
  import { AniIconLoading } from '$lib/icons';

  $: if ($authStore === null) {
    goto('/account/signin');
  }
  const userUid = $authStore?.uid;
  const storage = getStorage();

  let isHovered = false;
  let downloadLoading = false;

  const current_receipt_id = $page.params.receipt_id;

  async function docSnap() {
    const onReceiptViewCallable = getHttpsCallable('onReceiptViewCallable');
    const receiptData = await onReceiptViewCallable(current_receipt_id).catch(
      (err) => {
        console.log(err);
        goto('/');
      }
    );

    const data = receiptData.data;
    const receiptType = data.receiptType;
    if (receiptType !== 'manual') {
      goto(`/receipt/${current_receipt_id}`);
    }
    const date = dayjs(data.createdAt).format('YYYY/MM/DD');
    const time = dayjs(data.createdAt).format('hh:mm');
    return [data, date, time];
  }
  let promise = docSnap();

  async function assignReceipt() {
    const receiptRef = doc(firestore, 'receipts', current_receipt_id);
    updateDoc(receiptRef, {
      userUid: userUid,
    }).then(() => {
      window.location.reload();
    });
  }

  async function downloadReceipt() {
    downloadLoading = true;
    const pathRef = ref(storage, `ReceiptPDFs/${current_receipt_id}.pdf`);
    const onReceiptDownloadCallable = getHttpsCallable(
      'onReceiptDownloadCallable'
    );
    const userRef = doc(firestore, 'users', userUid);
    await updateDoc(userRef, {
      lastActionAt: serverTimestamp(),
    });
    try {
      const url = await getDownloadURL(pathRef);
      fetch(url, {
        headers: {
          'Content-Type': 'application/pdf',
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const file = window.URL.createObjectURL(blob);
          window.location.assign(file);
        });
    } catch (err) {
      await onReceiptDownloadCallable(current_receipt_id).catch((err) => {
        console.error(err);
      });
      getDownloadURL(pathRef)
        .then((url) => {
          fetch(url, {
            headers: {
              'Content-Type': 'application/pdf',
            },
          })
            .then((res) => res.blob())
            .then((blob) => {
              const file = window.URL.createObjectURL(blob);
              window.location.assign(file);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
</script>

<div
  class:hidden={!downloadLoading}
  class="flex fixed justify-center items-center inset-0 w-full bg-black/50">
  <div
    class="text-center text-md py-2 w-10/12 md:w-2/3 lg:w-1/3 xl:w-1/3 px-4 font-bold bg-white border-2">
    Receipt PDF is Generating<br />
    Wait a Moment...
    <AniIconLoading class="m-auto my-4" fill="#059669" />
  </div>
</div>

{#await promise}
  <div class="flex justify-center pt-64">
    <AniIconLoading class=" my-4" fill="#059669" />
  </div>
{:then data}
  <div class="md:grid md:grid-cols-2 my-4">
    <div class="flex justify-center mb-12">
      <div
        class="w-2/3 py-12 px-4 border-x-2 border-b-2 border-t-4 mx-6 border-t-emerald-600 shadow-lg">
        <div class="text-center">
          <hr class=" border-black border-[1px] border-dashed mb-6 mx-10" />

          <div>
            <div>{data[0].vendor.vendorName}</div>
            <div>{data[0].vendor.vendorLocation}</div>
            <div>{data[0].vendor.postalCode}</div>
          </div>

          <hr class="mt-6 mx-10 border-black border-[1px] border-dashed" />
        </div>

        <div class="grid grid-cols-6 mt-12">
          <div class="grid grid-cols-6 col-span-6 mb-6">
            {#each data[0].items as item}
              <div class="col-span-3">{item.itemName}</div>
              <div class="col-span-3 text-right">{item.price}</div>
            {/each}
          </div>
        </div>

        <hr class="my-6 mx-10 border-black border-[1px] border-dashed" />

        <div class="grid grid-cols-6">
          <div class="col-span-4">Subtotal</div>
          <div class="col-span-2 text-right">{data[0].subtotal}</div>

          <div class="col-span-4">GST</div>
          <div class="col-span-2 text-right">{data[0].gst}</div>

          <div class="col-span-4">Total</div>
          <div class="col-span-2 text-right">{data[0].total}</div>

          <div class="col-span-4 text-left">{data[0].paymentMethod}</div>
          <div class="col-span-2 text-right">{data[0].total}</div>

          <div class="col-span-4">Change</div>
          <div class="col-span-2 text-right">{data[0].change}</div>

          <div class="col-span-2">Receipt ID</div>
          <div class="col-span-4 text-right">{data[0].receiptId}</div>
        </div>
        <hr class="mt-6 mb-2 mx-10 border-black border-[1px] border-dashed" />
        <div class="flex justify-center mb-2">
          <div class="mr-4">{data[1]}</div>
          <div class="mr-4">{data[2]}</div>
        </div>
      </div>
    </div>
    <div class="font-normal text-xl text-center">
      Manually Input Receipt:
      <span class=" font-bold text-emerald-600">{data[0].receiptId}</span>
      <hr class="border-t-2 border-black border-dashed my-2 mx-24" />
      <button
        on:click={() => {
          downloadReceipt();
        }}
        class="text-sm mt-4 border-2 border-emerald-600 rounded-full w-2/3 py-3 transition hover:bg-emerald-600 hover:text-white"
        on:mouseover={() => (isHovered = true)}
        on:focus={() => (isHovered = true)}
        on:blur={() => (isHovered = false)}
        on:mouseover={() => (isHovered = true)}
        on:focus={() => (isHovered = true)}
        on:mouseout={() => (isHovered = false)}>
        <svg
          class="inline h-8 mr-2"
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1792.000000 2048.000000"
          preserveAspectRatio="xMidYMid meet">
          <g
            transform="translate(0.000000,2048.000000) scale(0.100000,-0.100000)"
            stroke="none">
            <path
              class:fill-white={isHovered}
              d="M1710 16912 l0 -3567 -810 -810 -810 -810 0 -3697 0 -3698 810 0 810
        0 0 -2165 0 -2165 7255 0 7255 0 0 2165 0 2165 810 0 810 0 0 3703 0 3702
        -810 810 -810 810 0 1130 0 1130 -2433 2433 -2432 2432 -4823 0 -4822 0 0
        -3568z m9080 388 l0 -2240 2243 -2 2242 -3 3 -1662 2 -1663 -6310 0 -6310 0 0
        3905 0 3905 4065 0 4065 0 0 -2240z m-5975 -6960 c381 -32 680 -106 918 -227
        286 -146 481 -342 625 -628 124 -247 171 -493 159 -835 -16 -462 -161 -815
        -457 -1110 -265 -265 -617 -429 -1078 -501 -119 -19 -191 -22 -539 -26 l-403
        -5 0 -774 0 -774 -650 0 -650 0 0 2445 0 2445 978 0 c565 0 1028 -4 1097 -10z
        m4405 -13 c607 -82 1012 -244 1347 -537 309 -270 535 -679 638 -1155 49 -229
        60 -356 60 -710 0 -346 -6 -431 -50 -670 -132 -714 -524 -1250 -1131 -1542
        -197 -95 -491 -181 -744 -217 -221 -32 -400 -37 -1215 -34 l-810 3 -3 2430
        c-1 1337 0 2436 3 2443 8 21 1745 11 1905 -11z m6110 -522 l0 -545 -945 0
        -945 0 0 -460 0 -460 810 0 810 0 0 -545 0 -545 -810 0 -810 0 0 -895 0 -895
        -650 0 -650 0 0 2445 0 2445 1595 0 1595 0 0 -545z m-50 -7170 l0 -1695 -6310
        0 -6310 0 0 1695 0 1695 6310 0 6310 0 0 -1695z" />
            <path
              class:fill-white={isHovered}
              d="M4040 8679 l0 -641 343 4 c319 4 347 6 417 27 237 71 387 231 434
        463 20 99 21 292 1 376 -53 225 -207 345 -509 397 -66 11 -165 15 -387 15
        l-299 0 0 -641z" />
            <path
              class:fill-white={isHovered}
              d="M8610 7905 l0 -1408 148 6 c345 15 577 86 760 233 263 210 392 523
        422 1022 20 332 -20 688 -99 890 -58 147 -124 255 -215 351 -188 197 -449 290
        -868 308 l-148 6 0 -1408z" />
          </g>
        </svg>
        Download as PDF</button>
    </div>
  </div>
{/await}
