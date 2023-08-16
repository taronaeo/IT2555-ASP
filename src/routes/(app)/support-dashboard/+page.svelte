<script>
  import { firestore } from '$lib/firebase';
  import {
    collection,
    getCountFromServer,
    query,
    orderBy,
    startAfter,
    limit,
    getDocs,
    endBefore,
    doc,
    getDoc,
    where,
    serverTimestamp,
    writeBatch,
  } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';
  import { formatNumber, isValidPhoneNumber } from 'libphonenumber-js';
  import { z } from 'zod';
  import { getHttpsCallable } from '$lib/firebase/functions';

  if (!$authStore) {
    goto('/account/signin');
  }

  $: {
    selectedChangeTrim = selectedChange.trim();
  }

  const userUid = $authStore.uid;

  const userRef = doc(firestore, 'users', userUid);
  getDoc(userRef)
    .then((doc) => {
      const data = doc.data();
      if (data.tenantId !== 'support-uxfrz') {
        goto('/account/signin');
      }
    })
    .catch((err) => console.error(err));

  const vendorRef = collection(firestore, 'vendors');
  onMount(() => {
    loadVendors();
    loadUsers();
  });

  let dismissed = false;
  let vendors = [];
  let users = [];
  let lastDoc;
  let firstDoc;
  let searchFilter = '';
  let searchFilterUser = '';
  let managingVendorUser = false;
  let managingVendorUserId = '';
  let managingNonVendor = false;

  const selectTypes = [
    { id: 1, text: 'Email' },
    { id: 2, text: 'Phone No' },
    { id: 3, text: 'Display Name' },
  ];

  let selectedChange = '';
  let selectedChangeTrim = '';

  function searchFilterArray() {
    let wordArray = [];
    const words = searchFilter.split(' ');

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1);
    }

    const capitalizedWords = words.join(' ');

    wordArray.push(searchFilter);
    wordArray.push(capitalizedWords);
    return wordArray;
  }

  function isBlank(str) {
    return !str.trim();
  }

  async function loadVendors() {
    let q;
    if (isBlank(searchFilter)) {
      q = query(
        vendorRef,
        where('isSuspended', '==', false),
        orderBy('vendorId'),
        ...(firstDoc ? [endBefore(firstDoc)] : []),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(15)
      );
    } else {
      q = query(
        vendorRef,
        where('isSuspended', '==', false),
        where('vendorName', 'in', searchFilterArray()),
        orderBy('vendorId'),

        ...(firstDoc ? [endBefore(firstDoc)] : []),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(15)
      );
    }

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    const data = docs.map((doc) => doc.data());
    firstDoc = docs[0];
    if (!firstDoc) {
      return;
    }
    lastDoc = docs[docs.length - 1];
    vendors = data;
  }

  async function paginateNext() {
    firstDoc = null;
    await loadVendors();
  }

  async function paginateBack() {
    lastDoc = null;
    await loadVendors();
  }

  function getVendorJoin(createdAt) {
    return dayjs(createdAt).format('YYYY/MM/DD');
  }

  async function getVendorDetails() {
    const vendorDocRef = doc(firestore, 'vendors', managingVendorUserId);
    const vendorDocSnap = await getDoc(vendorDocRef);
    const data = vendorDocSnap.data();
    return data;
  }

  async function updateVendor() {
    let vendorDocRef;
    let userDocRef;
    if (managingNonVendor) {
      vendorDocRef = doc(firestore, 'users', managingVendorUserId);
    } else {
      vendorDocRef = doc(firestore, 'vendors', managingVendorUserId);
      userDocRef = collection(firestore, 'users');
      const q = query(
        userDocRef,
        where('vendorId', '==', managingVendorUserId)
      );
      const userSnap = await getDocs(q);
      const data = userSnap.docs.map((doc) => doc.data());
      const userId = data[0].uid;
      userDocRef = doc(firestore, 'users', userId);
    }

    const phoneSchema = z.object({
      phoneNumber: z
        .string()
        .refine((phone) => isValidPhoneNumber(phone, 'SG'), {
          message: 'Invalid SG Phone Number',
        })
        .transform((phone) => formatNumber(phone, 'SG', 'INTERNATIONAL')),
    });
    if (isBlank(vendorCred) || isBlank(auditReason)) {
      alertMsg = 'Field must be filled in';
      return;
    }

    if (vendorCred !== vendorCredConfirm) {
      alertMsgConfirm = 'Confirmation field must be the same';
      return;
    }
    const batch = writeBatch(firestore);
    const auditRef = doc(collection(firestore, 'supportAudits'));

    let supportAuditDoc;

    if (managingNonVendor) {
      supportAuditDoc = {
        userId: managingVendorUserId,
        changedAt: serverTimestamp(),
        reasons: auditReason,
        fieldChanged: vendorCred,
      };
    } else if (!managingNonVendor) {
      supportAuditDoc = {
        vendorId: managingVendorUserId,
        changedAt: serverTimestamp(),
        reasons: auditReason,
        fieldChanged: vendorCred,
      };
    }
    batch.set(auditRef, supportAuditDoc);

    if (selectedChangeTrim === 'Email') {
      if (vendorCred.split('.com')[1] === undefined) {
        alertMsg = 'Must be Valid email';
        return;
      }
      if (managingNonVendor) {
        batch.update(vendorDocRef, {
          email: vendorCred,
        });
      } else if (!managingNonVendor) {
        batch.update(vendorDocRef, {
          vendorEmail: vendorCred,
        });
        batch.update(userDocRef, {
          email: vendorCred,
        });
      }
    } else if (selectedChangeTrim === 'Phone No') {
      try {
        phoneSchema.parse({ phoneNumber: vendorCred });
      } catch (err) {
        alertMsg = 'Invalid SG Phone Number';
        return;
      }
      if (managingNonVendor) {
        batch.update(vendorDocRef, {
          phoneNumber: phoneSchema.parse({ phoneNumber: vendorCred })
            .phoneNumber,
        });
      } else if (!managingNonVendor) {
        batch.update(vendorDocRef, {
          vendorPhoneNumber: phoneSchema.parse({ phoneNumber: vendorCred })
            .phoneNumber,
        });
        batch.update(userDocRef, {
          phoneNumber: phoneSchema.parse({ phoneNumber: vendorCred })
            .phoneNumber,
        });
      }
    } else if (selectedChangeTrim === 'Display Name') {
      if (managingNonVendor) {
        batch.update(vendorDocRef, {
          displayName: vendorCred,
        });
      } else if (!managingNonVendor) {
        batch.update(vendorDocRef, {
          vendorName: vendorCred,
        });
        batch.update(userDocRef, {
          displayName: vendorCred,
        });
      }
    }
    batch
      .commit()
      .then(() => {
        console.log('Successfully committed');
      })
      .catch((err) => console.error(err));
    window.location.reload();
  }

  let alertMsg = '';
  let alertMsgConfirm = '';
  let vendorCred = '';
  let vendorCredConfirm = '';

  let deletingVendorUser = false;

  async function deleteVendorAcc() {
    const auditRef = doc(collection(firestore, 'supportAudits'));
    if (isBlank(auditReason)) {
      alertMsg = 'Reasons must be given';
      return;
    }
    const batch = writeBatch(firestore);

    let supportAuditDoc;

    if (managingNonVendor) {
      supportAuditDoc = {
        userId: managingVendorUserId,
        changedAt: serverTimestamp(),
        reasons: auditReason,
        fieldChanged: vendorCred,
      };
    } else if (!managingNonVendor) {
      supportAuditDoc = {
        vendorId: managingVendorUserId,
        changedAt: serverTimestamp(),
        reasons: auditReason,
        fieldChanged: vendorCred,
      };
    }
    batch.set(auditRef, supportAuditDoc);

    if (managingNonVendor) {
      const userDocRef = doc(firestore, 'users', managingVendorUserId);
      batch.set(
        userDocRef,
        {
          isSuspended: true,
        },
        { merge: true }
      );
    } else if (!managingNonVendor) {
      const vendorDocRef = doc(firestore, 'vendors', managingVendorUserId);
      const userColRef = collection(firestore, 'users');
      const userQuery = query(
        userColRef,
        where('vendorId', '==', managingVendorUserId)
      );
      const userSnap = await getDocs(userQuery);
      const data = userSnap.docs.map((doc) => doc.data());
      const userUid = data[0].uid;
      const userDocRef = doc(firestore, 'users', userUid);
      batch.set(
        userDocRef,
        {
          isSuspended: true,
        },
        { merge: true }
      );
      batch.set(
        vendorDocRef,
        {
          isSuspended: true,
        },
        { merge: true }
      );
    }
    batch
      .commit()
      .then(() => {
        console.log('User Successfully Suspended');
      })
      .catch((err) => {
        console.error(`Error Suspending Account ${err}`);
      });
    window.location.reload();
  }

  let firstDocUser = null;
  let lastDocUser = null;

  async function loadUsers() {
    const userColref = collection(firestore, 'users');
    let q;
    if (isBlank(searchFilterUser)) {
      q = query(
        userColref,
        where('isSuspended', '==', false),
        where('tenantId', '==', null),
        orderBy('uid'),
        ...(firstDocUser ? [endBefore(firstDocUser)] : []),
        ...(lastDocUser ? [startAfter(lastDocUser)] : []),
        limit(15)
      );
    } else {
      q = query(
        userColref,
        where('isSuspended', '==', false),
        where('uid', '==', searchFilterUser),
        where('tenantId', '==', null),
        orderBy('uid'),

        ...(firstDocUser ? [endBefore(firstDocUser)] : []),
        ...(lastDocUser ? [startAfter(lastDocUser)] : []),
        limit(15)
      );
    }

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    const data = docs.map((doc) => doc.data());
    firstDocUser = docs[0];
    if (!firstDocUser) {
      return;
    }
    lastDocUser = docs[docs.length - 1];
    users = data;
  }

  async function paginateNextUser() {
    firstDocUser = null;
    await loadUsers();
  }

  async function paginateBackUser() {
    lastDocUser = null;
    await loadUsers();
  }

  async function getUserDetails() {
    const userDocRef = doc(firestore, 'users', managingVendorUserId);
    const userDocSnap = await getDoc(userDocRef);
    const data = userDocSnap.data();
    return data;
  }

  let auditReason = '';

  async function getStripeDetails(vendorId) {
    const vendorStripeDetailsCallable = getHttpsCallable(
      'vendorStripeDetailsCallable'
    );
    const billingDataObj = await vendorStripeDetailsCallable(vendorId);
    const billingData = billingDataObj.data;
    const billingDate = dayjs
      .unix(billingData.billingDate)
      .format('YYYY-MM-DD');
    const billingAmount = billingData.billingAmount;
    return {
      billingDate: billingDate,
      billingAmount: billingAmount,
    };
  }
</script>

<div>
  <div
    class:hidden={!deletingVendorUser}
    class="flex fixed justify-center items-center inset-0 w-full bg-black/50 z-10">
    <div class="text-center text-md py-2 w-1/3 px-4 bg-white border-2">
      Suspending User ID: <span class="font-bold text-emerald-500"
        >{managingVendorUserId}</span>
      <hr
        class="border-[1px] w-4/5 m-auto mt-1 mb-2 border-gray-300 border-dashed" />
      <div class="font-bold">Users can be unsupended in the future</div>
      <div class="text-left text-sm mx-4">
        <div class="mt-2">
          Field Changed<span class="text-red-500">*</span>
        </div>
        <input
          readonly
          value="Suspending Account"
          class="px-2 w-full border-2 rounded mt-1 bg-gray-100" />
        <div class="my-2">
          Reasons<span class="text-red-500">*</span>
          <textarea
            bind:value={auditReason}
            placeholder="Continuous misbehaviour..."
            class="px-2 w-full border-2 rounded mt-1 border-gray-200 bg-gray-100 resize-none" />
          {#if !isBlank(alertMsg)}
            <div class="text-xs text-red-500">{alertMsg}</div>
          {/if}
        </div>
      </div>
      <div class="mt-4">
        <button
          on:click={() => {
            deleteVendorAcc();
          }}
          class="px-5 py-2 rounded-lg text-sm
                text-white text-center font-medium
                border-2 border-emerald-500
                bg-emerald-500 hover:bg-emerald-700
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:cursor-not-allowed disabled:opacity-75">
          Confirm
        </button>
        <button
          on:click={() => {
            deletingVendorUser = false;
          }}
          class="px-5 py-2 rounded-lg border-2 text-sm
                text-emerald-500 text-center font-medium
                bg-white hover:bg-emerald-500
                border-emerald-500 hover:text-white
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:cursor-not-allowed disabled:opacity-75">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div
    class:hidden={!managingVendorUser}
    class="flex fixed justify-center items-center inset-0 w-full bg-black/50 z-10">
    <div class="text-center text-md py-2 w-1/3 px-4 bg-white border-2">
      Managing
      {#if managingNonVendor}
        <span>User</span>
      {:else}<span>Vendor</span>
      {/if}
      ID: <span class="font-bold text-emerald-500">{managingVendorUserId}</span>
      <hr
        class="border-[1px] w-4/5 m-auto mt-1 mb-3 border-gray-300 border-dashed" />
      <div class="flex flex-row ml-4">
        <div class="flex flex-col text-left">
          {#if managingNonVendor}
            <div>Name</div>
            <div>Email</div>
            <div>Phone No.</div>
          {:else}
            <div>Name</div>
            <div>Email</div>
            <div>Phone No.</div>
            <div>UEN</div>
            <div>Stripe ID</div>
          {/if}
        </div>
        <div class="flex flex-col font-bold text-left text-emerald-500 mx-4">
          {#if managingVendorUser}
            {#if managingNonVendor}
              {#await getUserDetails() then userData}
                <div>{userData.displayName}</div>
                <div>{userData.email}</div>
                <div>{userData.phoneNumber}</div>
              {/await}
            {:else}
              {#await getVendorDetails() then vendorData}
                <div>{vendorData.vendorName}</div>
                <div>{vendorData.vendorEmail}</div>
                <div>{vendorData.vendorPhoneNumber}</div>
                <div>{vendorData.vendorUen}</div>
                <div>{vendorData.stripeId}</div>
              {/await}
            {/if}
          {/if}
        </div>
      </div>
      <hr
        class="border-[1px] w-4/5 m-auto my-3 border-gray-300 border-dashed" />
      <div class="">
        <div class="text-sm mb-1"> Select Type of Credential Change </div>
        <select class="h-6 text-sm py-0 pl-2" bind:value={selectedChange}>
          {#each selectTypes as option}
            <option class="text-left">
              {option.text}
            </option>
          {/each}
        </select>
      </div>
      <div class="mx-4 text-left text-sm">
        {#if selectedChangeTrim === 'Email'}
          <div class="mt-4">
            New Email
            <span class="text-red-500">*</span>
          </div>
          <input
            bind:value={vendorCred}
            placeholder="example@email.com"
            class="px-2 w-full border-2 rounded mt-1 bg-gray-100" />
          {#if !isBlank(alertMsg)}
            <div class="text-xs text-red-500 mb-4">{alertMsg}</div>
          {/if}
          <div class="mt-2">
            Confirm Email
            <span class="text-red-500">*</span>
          </div>
          <input
            bind:value={vendorCredConfirm}
            placeholder="example@email.com"
            class="px-2 w-full border-2 rounded mt-1 bg-gray-100" />
          {#if !isBlank(alertMsgConfirm)}
            <div class="text-xs text-red-500">{alertMsgConfirm}</div>
          {/if}
        {:else if selectedChangeTrim === 'Phone No'}
          <div class="mt-4">
            New Phone No
            <span class="text-red-500">*</span>
          </div>
          <input
            bind:value={vendorCred}
            placeholder="8888 8888"
            class="px-2 w-full border-2 rounded mt-1 bg-gray-100" />
          {#if !isBlank(alertMsg)}
            <div class="text-xs text-red-500 mb-4">{alertMsg}</div>
          {/if}
          <div class="mt-2">
            Confirm Phone No
            <span class="text-red-500">*</span>
          </div>
          <input
            bind:value={vendorCredConfirm}
            placeholder="8888 8888"
            class="px-2 w-full border-2 rounded mt-1 bg-gray-100" />
          {#if !isBlank(alertMsgConfirm)}
            <div class="text-xs text-red-500">{alertMsgConfirm}</div>
          {/if}
        {:else if selectedChangeTrim === 'Display Name'}
          <div class="mt-4">
            New Display Name
            <span class="text-red-500">*</span>
          </div>
          <input
            bind:value={vendorCred}
            placeholder="Snake Eyes"
            class="px-2 w-full border-2 rounded mt-1 bg-gray-100" />
          {#if !isBlank(alertMsg)}
            <div class="text-xs text-red-500 mb-4">{alertMsg}</div>
          {/if}
          <div class="mt-2">
            Confirm Display Name
            <span class="text-red-500">*</span>
          </div>
          <input
            bind:value={vendorCredConfirm}
            placeholder="Snake Eyes"
            class="px-2 w-full border-2 rounded mt-1 bg-gray-100" />
          {#if !isBlank(alertMsgConfirm)}
            <div class="text-xs text-red-500">{alertMsgConfirm}</div>
          {/if}
        {/if}
      </div>
      <div class="text-left text-sm mx-4">
        <div class="mt-2">
          Field Changed<span class="text-red-500">*</span>
        </div>
        <input
          readonly
          bind:value={selectedChangeTrim}
          placeholder="Email"
          class="px-2 w-full border-2 rounded mt-1 bg-gray-100" />
        <div class="my-2">
          Reasons<span class="text-red-500">*</span>
          <textarea
            bind:value={auditReason}
            placeholder="Upon user request..."
            class="px-2 w-full border-2 rounded mt-1 border-gray-200 bg-gray-100 resize-none" />
          {#if !isBlank(alertMsg)}
            <div class="text-xs text-red-500">{alertMsg}</div>
          {/if}
        </div>
      </div>
      <div class="my-2">
        <button
          on:click={() => {
            updateVendor();
          }}
          class="px-5 py-2 rounded-lg text-sm
                text-white text-center font-medium
                border-2 border-emerald-500
                bg-emerald-500 hover:bg-emerald-700
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:cursor-not-allowed disabled:opacity-75">
          Confirm
        </button>
        <button
          on:click={() => {
            managingVendorUser = false;
          }}
          class="px-5 py-2 rounded-lg border-2 text-sm
                text-emerald-500 text-center font-medium
                bg-white hover:bg-emerald-500
                border-emerald-500 hover:text-white
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:cursor-not-allowed disabled:opacity-75">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div class:hidden={dismissed} class="flex justify-center pt-6">
    <div class="w-4/5 py-5 text-center border-2 rounded-lg font-bold leading-8">
      <img
        src="ig-verified-regular.svg"
        alt="verified logo"
        class="inline -mr-1 -mt-1" />
      Active vendor info displayed here
      <button
        on:click={() => {
          dismissed = true;
        }}
        class="absolute right-52 mt-2 text-blue-600 font-normal text-xs"
        >Dismiss</button>
      <div class="font-normal">
        Click on the vendor or user IDs to manage their information. Only adjust
        information upon request.
      </div>
      <div class="font-normal"
        >Click <button
          on:click={() => {
            goto('/support-tickets');
          }}
          class="text-emerald-500 underline">here</button> to check out support tickets</div>
    </div>
  </div>

  <div class="flex justify-center mt-6 mb-1">
    <div class="w-4/5"> Search by vendor name </div>
  </div>
  <div class="flex justify-center">
    <div class="w-4/5 flex flex-row h-8">
      <button
        on:click={() => {
          firstDoc = null;
          lastDoc = null;
          loadVendors();
        }}
        class="w-1/12 bg-emerald-500 text-white rounded-l-lg mr-1"
        >Search</button>
      <input
        bind:value={searchFilter}
        placeholder="Enter vendor name here..."
        class="px-2 border-y-2 border-r-2 focus:outline-emerald-500 focus:border-none w-11/12 rounded-r-lg -ml-1 focus:border-4" />
    </div>
  </div>

  <div class="flex justify-center mt-4">
    <div class="w-4/5 grid grid-cols-6 border-2 rounded-lg">
      <div
        class="grid grid-cols-6 col-span-6 bg-emerald-500 text-white py-2 rounded-t-lg">
        <div class="flex justify-left mx-4"
          ><img
            src="ig-verified-white.svg"
            alt="verified logo"
            class="inline mr-1" />
          {vendors.length} Active</div>

        <div class="flex justify-center">Vendor Name</div>

        <div class="flex justify-center">Next Billing Date</div>

        <div class="flex justify-center">Next Billing Amount</div>

        <div class="flex justify-center">Join Date</div>

        <div class="flex justify-center">Suspend Account</div>
      </div>

      {#if vendors.length === 0}
        <div class="col-span-6 px-4">No active vendors currently.</div>
      {/if}

      {#each vendors as vendor}
        {#if vendor.vendorId !== $authStore.vendorId}
          <div class="grid border-b-[1px] grid-cols-6 col-span-6 py-2 text-sm">
            <div class="flex justify-left items-center mx-4">
              <img
                src="ig-verified-regular.svg"
                alt="verified logo"
                class="inline mr-1 -mt-1" />
              <button
                on:click={() => {
                  managingVendorUserId = vendor.vendorId;
                  managingVendorUser = true;
                  managingNonVendor = false;
                }}
                class="text-emerald-600 underline">{vendor.vendorId}</button>
            </div>

            <div class="flex justify-center items-center">
              <button class="inline">{vendor.vendorName}</button>
            </div>

            <div class="flex justify-center items-center">
              {#await getStripeDetails(vendor.vendorId) then stripeDetails}
                {stripeDetails.billingDate}
              {/await}
            </div>

            <div class="flex justify-center items-center">
              {#await getStripeDetails(vendor.vendorId) then stripeDetails}
                {stripeDetails.billingAmount}
              {/await}
            </div>

            <div class="flex justify-center items-center"
              >{getVendorJoin(vendor.createdAt)}</div>

            <div class="flex justify-center items-center"
              ><button
                on:click={() => {
                  deletingVendorUser = true;
                  managingVendorUserId = vendor.vendorId;
                }}
                class="text-red-500 underline">Suspend</button
              ></div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
  <button on:click={paginateBack} class="float-left ml-40"
    ><img src="chevron-left.svg" alt="right arrow" class="mt-2" /></button>

  <button on:click={paginateNext} class="float-left ml-24"
    ><img src="chevron-right.svg" alt="right arrow" class="mt-2" /></button>
</div>

<div class="pt-4">
  <div class="flex justify-center mt-12 mb-1">
    <div class="w-4/5"> Search by user (non-vendors) UID </div>
  </div>
  <div class="flex justify-center">
    <div class="w-4/5 flex flex-row h-8">
      <button
        on:click={() => {
          firstDocUser = null;
          lastDocUser = null;
          loadUsers();
        }}
        class="w-1/12 bg-emerald-500 text-white rounded-l-lg mr-1"
        >Search</button>
      <input
        bind:value={searchFilterUser}
        placeholder="Enter user UID here..."
        class="px-2 border-y-2 border-r-2 focus:outline-emerald-500 focus:border-none w-11/12 rounded-r-lg -ml-1 focus:border-4" />
    </div>
  </div>

  <div class="flex justify-center mt-4">
    <div class="w-4/5 grid grid-cols-4 border-2 rounded-lg">
      <div
        class="grid grid-cols-4 col-span-4 bg-emerald-500 text-white py-2 rounded-t-lg">
        <div class="flex justify-left mx-4"
          ><img
            src="ig-verified-white.svg"
            alt="verified logo"
            class="inline mr-1" />
          {users.length} Active</div>

        <div class="flex justify-center">User Name</div>

        <div class="flex justify-center">Join Date</div>

        <div class="flex justify-center">Suspend Account</div>
      </div>
      {#if users.length === 0}
        <div class="px-4 col-span-4"> No Active Users Currently. </div>
      {/if}

      {#each users as user}
        {#if user.uid !== $authStore.uid}
          <div class="grid border-b-[1px] grid-cols-4 col-span-4 py-2 text-sm">
            <div class="flex justify-left items-center mx-4">
              <img
                src="ig-verified-regular.svg"
                alt="verified logo"
                class="inline mr-1 -mt-1" />
              <button
                on:click={() => {
                  managingVendorUserId = user.uid;
                  managingVendorUser = true;
                  managingNonVendor = true;
                }}
                class="text-emerald-600 underline">{user.uid}</button>
            </div>

            <div class="flex justify-center items-center">
              <button class="inline">{user.displayName}</button>
            </div>

            <div class="flex justify-center items-center"
              >{getVendorJoin(user.createdAt.toMillis())}</div>

            <div class="flex justify-center items-center"
              ><button
                on:click={() => {
                  deletingVendorUser = true;
                  managingVendorUserId = user.uid;
                  managingNonVendor = true;
                }}
                class="text-red-500 underline">Suspend</button
              ></div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
  <button on:click={paginateBackUser} class="float-left ml-40"
    ><img src="chevron-left.svg" alt="right arrow" class="mt-2" /></button>

  <button on:click={paginateNextUser} class="float-left ml-24"
    ><img src="chevron-right.svg" alt="right arrow" class="mt-2" /></button>
</div>
