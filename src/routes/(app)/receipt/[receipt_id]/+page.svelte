<script>
  import { firestore } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores';
  import { getStorage, ref, getDownloadURL } from 'firebase/storage';
  import { AniIconLoading } from '$lib/icons';
  import dayjs from 'dayjs';
  import { getHttpsCallable } from '$lib/firebase/functions';
  import { AuthGuard } from '$lib/components';

  const userUid = $authStore?.uid;
  const storage = getStorage();
  let isHovered = false;

  const current_receipt_id = $page.params.receipt_id;

  let assigned = true;

  async function docSnap() {
    const onReceiptViewCallable = getHttpsCallable('onReceiptViewCallable');
    const receiptData = await onReceiptViewCallable(current_receipt_id).catch(
      (err) => {
        console.error(err);
      }
    );

    const data = receiptData.data;
    const receiptType = data.receiptType;
    if (receiptType === 'manual') {
      goto(`/indiv-receipt/${current_receipt_id}`);
    }
    const date = dayjs(data.createdAt).format('YYYY/MM/DD');
    const time = dayjs(data.createdAt).format('hh:mm');
    let fileSnap;
    try {
      fileSnap = await getDownloadURL(
        ref(storage, `VendorLogos/${data.vendor.vendorId}.svg`)
      );
    } catch {
      fileSnap = '../favicon.ico';
    }
    if (!data.userUid) {
      assigned = false;
    }
    return [data, fileSnap, date, time];
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
  let downloadLoading = false;
</script>

<AuthGuard>
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
  <div class="px-4">
    <div class="md:grid md:gap-8 md:grid-cols-2 md:grid-rows-3 my-4">
      <div class=" border-t-4 border-emerald-600 bg-slate-400">
        {#await promise}
          <div class="bg-white h-full flex items-center justify-center">
            <AniIconLoading fill="#059669" />
          </div>
        {:then receipt_data}
          <div
            class=" whitespace-normal m-auto col-span-2 md:col-span-1 bg-white py-6 shadow-lg">
            <div class="text-center">
              <!--Div for header-->
              <div class="text-2xl font-bold my-2"
                ><img
                  class="h-20 inline text-center"
                  src={receipt_data[1]}
                  alt="logo" /></div>
              <div class="text-md font-light"
                >{receipt_data[0]['vendor'].vendorName}</div>
              <div class="text-md font-light"
                >{receipt_data[0]['vendor'].vendorLocation}</div>
              <div class="text-md font-light"
                >Singapore {receipt_data[0]['vendor'].postalCode}</div>
              <div class="text-left text-lg font-bold ml-6"
                >Receipt ID: <span>{receipt_data[0]['receiptId']}</span></div>
              <div class=""
                ><hr
                  class="border-t-2 border-black border-dashed mb-2 mx-6" /></div>
            </div>
            <div class=" leading-7 grid grid-cols-6 mx-6 font-light">
              {#each receipt_data[0]['items'] as item}
                <div class="col-span-5">{item.itemName}</div>
                <div class="col-span-1 text-right">${item.price}</div>
              {/each}
            </div>
            <div class=""
              ><hr
                class="border-t-2 border-black border-dashed mb-2 mx-6" /></div>
            <div class="grid grid-cols-6">
              <!--receipt Totals div-->

              <div class="col-span-1 mx-6 font-semibold">SUBTOTAL</div>
              <div class="col-span-5 mx-6 text-right"
                >${receipt_data[0]['subtotal']}</div>

              <div class="col-span-1 mx-6 font-semibold"
                >GST<span class="font-thin">(8%)</span></div>
              <div class="col-span-5 mx-6 text-right"
                >${receipt_data[0]['gst']}</div>

              <div class="col-span-1 mx-6 font-semibold">TOTAL</div>
              <div class="col-span-5 mx-6 text-right"
                >${receipt_data[0]['total']}</div>

              <div class="col-span-1 mx-6 font-semibold">CHANGE</div>
              <div class="col-span-5 mx-6 text-right"
                >${receipt_data[0]['change']}</div>

              <div class="col-span-2 mx-6 font-semibold"
                >{receipt_data[0]['paymentMethod']}</div>
              <div class="col-span-4 mx-6 text-right"
                >${receipt_data[0]['total']}</div>
            </div>

            <div class=""
              ><hr
                class="border-t-2 border-black border-dashed my-2 mx-6" /></div>
            <div class="mx-6 grid grid-cols-6">
              <!--footer div-->
              <div class="text-center col-span-6"
                ><span class="mr-2">{receipt_data[2]}</span>
                <span class="mr-1">{receipt_data[3]}</span></div>
            </div>
            <div class="pl-6 font-bold text-emerald-600 text-left"
              ><img
                src="../ig-verified-regular.svg"
                class="inline -mt-1"
                alt="verified icon" />Dr. Receipts Verified
            </div>
          </div>
        {/await}
      </div>

      <div class="md:col-span-1">
        {#if assigned}
          <div class="my-6 text-center">
            <button
              on:click={() => {
                downloadReceipt();
              }}
              class="border-2 border-emerald-600 rounded-full w-full py-3 transition hover:bg-emerald-600 hover:text-white"
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
        {/if}
        <div class="md:h-28 md:my-0 my-3 border-2 px-3 py-3 shadow rounded-lg">
          <div class:hidden={!assigned}>
            <div class="text-center">Have troubles with this receipt?</div>
            <div class="text-center"
              ><a
                href="/disputeHandling"
                class="block md:mt-3 border-2 bg-emerald-600 px-5 py-2.5 m-2 text-white rounded-lg text-center"
                >File Disputes with Vendor</a
              ></div>
          </div>
          <div class:hidden={assigned}>
            <div class="text-center">Want to assign receipt to account?</div>
            <div class="text-center"
              ><button
                on:click={() => {
                  assignReceipt();
                }}
                class="md:mt-3 border-2 bg-emerald-600 px-5 py-2.5 m-2 text-white rounded-lg text-center"
                >Assign to Account</button
              ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</AuthGuard>
