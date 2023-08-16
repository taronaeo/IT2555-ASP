<script lang="ts">
  import { goto } from '$app/navigation';
  import { getHttpsCallable } from '$lib/firebase/functions';
  import { authStore } from '$lib/stores';

  if (!$authStore) {
    goto('/account/signin');
  }

  let addingItems: boolean = false;

  let alert: string = '';
  let itemAlert: string = '';

  let gstType: string = '';

  let itemName: string = '';
  let price: string = '';

  let receiptId: string = '';
  let vendorName: string = '';
  let vendorLocation: string = '';
  let postalCode: string = '';
  let items: { itemName: string; price: string }[] = [];
  let subtotal: string = '';
  let gst: string = '';
  let total: string = '';
  let paymentMethod: string = '';
  let change: string = '';
  let date: string = '';
  let time: string = '';

  $: {
    if (!isNaN(Number(subtotal))) {
      gst = `${(Number(subtotal) * 0.08).toFixed(2)}`;
      if (gstType === 'incl') {
        total = subtotal;
      } else if (gstType === 'excl') {
        total = `${(Number(subtotal) + Number(gst)).toFixed(2)}`;
      }
    }
  }
  function changeGstType(event: Event): void {
    const target = event.currentTarget as HTMLInputElement;
    if (target) {
      gstType = target.value;
    }
  }

  function addItem(): void | undefined {
    if (isBlank(itemName) || isBlank(price)) {
      itemAlert = 'Fill in all fields';
      return;
    }
    if (isNaN(Number(price))) {
      itemAlert = 'Price must be a number';
      return;
    }
    price = Number(price).toFixed(2);
    const item: { itemName: string; price: string } = {
      itemName: itemName,
      price: price,
    };
    items.push(item);
    items = items;
    addingItems = false;
    itemName = '';
    price = '';
  }
  function isBlank(str: string) {
    return !str.trim();
  }

  async function submitReceipt() {
    const inputReceipt = {
      receiptId: receiptId,
      vendorName: vendorName,
      vendorLocation: vendorLocation,
      postalCode: postalCode,
      subtotal: subtotal,
      total: total,
      change: change,
      date: date,
      time: time,
      paymentMethod: paymentMethod,
      gst: gst,
    };
    if (isBlank(gstType)) {
      alert = 'Must select GST Type for items';
      return;
    }

    if (items.length === 0) {
      alert = 'Add Items';
      return;
    }
    const dataCloudFunc = {
      receipt: inputReceipt,
      items: items,
    };
    const onManualReceiptSubmitCallable = getHttpsCallable(
      'onManualReceiptSubmitCallable'
    );
    const validReceipt = await onManualReceiptSubmitCallable(dataCloudFunc);
    const validReceiptData = validReceipt.data as {
      type: string;
      message: string;
    };
    if (validReceiptData.type === 'errorMsg') {
      alert = validReceiptData.message;
      return;
    }
    const receiptDocId = validReceiptData.message;
    goto(`indiv-receipt/${receiptDocId}`);
  }
</script>

<div
  class:hidden={!addingItems}
  class="flex fixed justify-center items-center inset-0 w-full bg-black/50 z-10">
  <div class="text-center text-md py-2 w-4/5 px-4 bg-white border-2">
    <div class="font-bold text-lg"> Add Items </div>
    {#if !isBlank(itemAlert)}
      <div
        class="text-left my-4 p-4 col-span-1 md:col-span-2 flex flex-row gap-1 text-sm text-red-800 bg-red-100 rounded-lg"
        role="alert">
        <div class="w-5 h-5">
          <img
            src="exclaimation.svg"
            alt="Exclaimation Icon"
            draggable="false" />
        </div>

        <p class="grow">
          {itemAlert}
        </p>
      </div>
    {/if}

    <div class="text-left">
      <div class="">
        Item Name<span class="text-red-500">*</span>
      </div>
      <input
        bind:value={itemName}
        placeholder="Apples"
        class="mt-1 px-2 py-1 border-2 w-full rounded" />
    </div>
    <div class="text-left">
      <div class="mt-4">
        Item Price<span class="text-red-500">*</span>
      </div>
      <input
        bind:value={price}
        placeholder="30.50"
        class="mt-1 px-2 py-1 border-2 w-full rounded" />

      <div class="mt-4 text-center">
        <button
          on:click={() => {
            addItem();
          }}
          class="px-5 py-2 rounded-lg text-sm
                text-white text-center font-medium
                border-2 border-emerald-600
                bg-emerald-600 hover:bg-emerald-800
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:cursor-not-allowed disabled:opacity-75">
          Confirm
        </button>
        <button
          on:click={() => {
            addingItems = false;
          }}
          class="px-5 py-2 rounded-lg border-2 text-sm
                text-emerald-600 text-center font-medium
                bg-white hover:bg-emerald-600
                border-emerald-600 hover:text-white
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:cursor-not-allowed disabled:opacity-75">
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>

<div class="lg:grid lg:grid-cols-2">
  <div
    class="lg:self-start py-12 px-4 border-x-2 border-b-2 border-t-4 mx-6 border-t-emerald-600 shadow-lg">
    <div class="text-center">
      <hr class=" border-black border-[1px] border-dashed mb-6 mx-10" />

      <div>
        {#if isBlank(vendorName)}
          <div>Add the Vendor's Name</div>
        {:else}
          <div>{vendorName}</div>
        {/if}
        {#if isBlank(vendorLocation)}
          <div>Add the Vendor's Location</div>
        {:else}
          <div>{vendorLocation}</div>
        {/if}
        {#if isBlank(postalCode)}
          <div>Add the Vendor's Postal Code</div>
        {:else}
          <div>{postalCode}</div>
        {/if}
      </div>

      <hr class="mt-6 mx-10 border-black border-[1px] border-dashed" />
    </div>

    <div class="grid grid-cols-6 mt-12">
      <div class="grid grid-cols-6 col-span-6 mb-6">
        {#if items.length === 0}
          <div class="col-span-6">Add Items</div>
        {/if}
        {#each items as item}
          <div class="col-span-5">{item.itemName}</div>
          <div class="col-span-1 text-right">{item.price}</div>
        {/each}
      </div>
    </div>

    <hr class="my-6 mx-10 border-black border-[1px] border-dashed" />

    <div class="grid grid-cols-6">
      <div class="col-span-4">Subtotal</div>
      {#if isBlank(subtotal) || subtotal === '0'}
        <div class="col-span-2 text-right">Add a subtotal</div>
      {:else}
        <div class="col-span-2 text-right">{subtotal}</div>
      {/if}

      <div class="col-span-4">GST</div>
      <div class="col-span-2 text-right">{gst}</div>

      <div class="col-span-4">Total</div>
      <div class="col-span-2 text-right">{total}</div>

      {#if isBlank(paymentMethod)}
        <div class="col-span-4 text-left">Add a Payment Method</div>
        <div class="col-span-2 text-right" />
      {:else}
        <div class="col-span-4 text-left">{paymentMethod}</div>
        <div class="col-span-2 text-right">{total}</div>
      {/if}

      <div class="col-span-4">Change</div>
      <div class="col-span-2 text-right">{change}</div>

      <div class="col-span-2">Receipt ID</div>
      {#if isBlank(receiptId)}
        <div class="col-span-4 text-right">Add a Receipt ID</div>
      {:else}
        <div class="col-span-4 text-right">{receiptId}</div>
      {/if}
    </div>
    <hr class="mt-6 mb-2 mx-10 border-black border-[1px] border-dashed" />
    <div class="flex justify-center mb-2">
      {#if isBlank(date)}
        <div class="mr-4">Add a date</div>
      {:else}
        <div class="mr-4">{date}</div>
      {/if}
      {#if isBlank(time)}
        <div class="mr-4">Add a time</div>
      {:else}
        <div class="mr-4">{time}</div>
      {/if}
    </div>
  </div>

  <div class="mt-6 mx-6">
    <div class="font-bold text-xl"> Input Receipt Details </div>
    {#if !isBlank(alert)}
      <div
        class="my-4 p-4 col-span-1 md:col-span-2 flex flex-row gap-1 text-sm text-red-800 bg-red-100 rounded-lg"
        role="alert">
        <div class="w-5 h-5">
          <img
            src="exclaimation.svg"
            alt="Exclaimation Icon"
            draggable="false" />
        </div>

        <p class="grow">
          {alert}
        </p>
      </div>
    {/if}

    <div />

    <div class="mt-4">
      Receipt ID<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={receiptId}
      placeholder="123456ABCD"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Name of Vendor Purchased From<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={vendorName}
      placeholder="Dr Receipts INC"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Location of Purchase<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={vendorLocation}
      placeholder="Hougang Rd 8, Blk 301, #08-31"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Postal Code of Location Purchased From<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={postalCode}
      placeholder="304293"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Items<span class="text-red-500">*</span>
      <div class="inline-block text-sm">
        <input
          checked={gstType === 'incl'}
          on:change={changeGstType}
          class="ml-8 mr-1"
          type="radio"
          id="incl"
          value="incl" />
        <label for="incl">Incl. GST</label>
        <input
          checked={gstType === 'excl'}
          on:change={changeGstType}
          class="ml-4 mr-1"
          type="radio"
          id="excl"
          value="excl" />
        <label for="excl">Excl. GST</label>
      </div>
      <div>
        <button
          on:click={() => {
            addingItems = true;
          }}
          class="border-emerald-600 border-2 rounded px-1.5 mt-2 text-sm"
          ><img
            src="plus-icon.svg"
            alt="plus icon"
            class="inline w-7 mt-1 -ml-1" />Add Item</button>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4 text-sm">
        {#each items as item}
          <div class="flex flex-row rounded border-2 p-1">
            <div class="flex flex-col mr-2">
              <div>Name</div>
              <div>Price</div>
            </div>
            <div class="flex flex-col truncate">
              <div class="text-emerald-600">{item.itemName}</div>
              <div class="text-emerald-600">{item.price}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="mt-2">
      Subtotal<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={subtotal}
      placeholder="99.99"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Total<span class="text-red-500">*</span>
    </div>
    <input
      readonly
      bind:value={total}
      placeholder="99.99"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      GST<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={gst}
      readonly
      placeholder="0.00"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Payment Method<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={paymentMethod}
      placeholder="VISA"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Change<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={change}
      placeholder="0.00"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Date<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={date}
      type="date"
      placeholder="2023/12/30"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="mt-4">
      Time<span class="text-red-500">*</span>
    </div>
    <input
      bind:value={time}
      type="time"
      placeholder="00:00"
      class="mt-1 px-2 py-1 border-2 w-full rounded" />

    <div class="my-4 text-center">
      <button
        on:click={() => {
          submitReceipt();
        }}
        class="px-5 py-2 rounded-xl text-sm
              text-white text-center font-medium
              border-2 border-emerald-600
              bg-emerald-600 hover:bg-emerald-800
              focus:outline-none focus:ring-4 focus:ring-green-300
              disabled:cursor-not-allowed disabled:opacity-75
              w-44">
        Confirm
      </button>
    </div>
  </div>
</div>
