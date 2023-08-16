<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';
  import { auth, firestore } from '$lib/firebase';
  import {
    collection,
    serverTimestamp,
    doc,
    updateDoc,
    setDoc,
  } from 'firebase/firestore';
  import type { SupportTicket } from '$lib/models/SupportTicket';

  if (!$authStore) {
    goto('/account/signin');
  }

  const username: string = $authStore!.displayName!;
  const userUid: string = $authStore!.uid;
  let userType: string = 'user';
  if ($authStore!.tenantId) {
    userType = 'vendor';
  }

  let inquiryTypes: { id: number; text: string }[] = [
    { id: 1, text: 'Password Change' },
    { id: 2, text: 'Email Change' },
    { id: 3, text: 'Phone Number Change' },
    { id: 4, text: 'Others' },
  ];

  if (userType === 'vendor') {
    inquiryTypes.splice(3, 0, {
      id: 5,
      text: 'Billing Issue',
    });
  }

  let selectedInquiry: { id: number; text: string } | undefined;
  let commsAgree: boolean = false;
  let invalid: boolean = false;
  let ticketGenerated: boolean = false;
  let alert: string = '';
  let inquiryDesc: string = '';
  let ticketId: string = '';

  function isBlank(str: string) {
    return !str.trim();
  }

  async function submit() {
    if (!selectedInquiry || isBlank(inquiryDesc)) {
      invalid = true;
      alert = 'Please fill in all fields';
      return;
    }

    const inquiryType: string = selectedInquiry!.text;
    const supportCollectionRef = collection(firestore, 'supportTickets');
    const userDocRef = doc(firestore, 'users', userUid);
    const supportDocRef = doc(supportCollectionRef);
    inquiryDesc = inquiryDesc.replace(
      /[\u00A0-\u9999<>\&]/g,
      (i) => '&#' + i.charCodeAt(0) + ';'
    );

    try {
      await setDoc(supportDocRef, {
        ticketId: supportDocRef.id,
        userUid: userUid,
        inquiryType: inquiryType,
        inquiryDesc: inquiryDesc,
        createdAt: serverTimestamp(),
        isResolved: false,
      } satisfies SupportTicket);

      await updateDoc(userDocRef, {
        ticketCreatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error occurred creating support ticket');
    }

    ticketId = supportDocRef.id;
    ticketGenerated = true;
    commsAgree = false;
    inquiryDesc = '';
  }
</script>

<div
  class:hidden={!ticketGenerated}
  class="flex fixed justify-center items-center inset-0 w-full bg-black/50">
  <div
    class="text-center text-md py-2 w-10/12 md:w-2/3 lg:w-1/3 xl:w-1/3 px-4 font-bold bg-white border-2">
    <div>
      Support Ticket Successfully Generated!<br />
      Ticket ID: {ticketId}
    </div>
    <button
      on:click={() => {
        ticketGenerated = false;
      }}
      class="my-4 px-5 py-2.5 rounded-lg
                text-white text-center font-medium
                bg-emerald-600 hover:bg-emerald-700
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:cursor-not-allowed disabled:opacity-75">
      Close
    </button>
  </div>
</div>

<div
  class="px-12 pb-6 pt-12 text-emerald-600 md:gap-x-10 lg:px-24 xl:px-32 w-5/6">
  {#if userType === 'user'}
    <h1 class="font-bold text-4xl"
      >Connect with Us: Enquiries Regarding your Account are Welcome</h1>
  {:else if userType === 'vendor'}
    <h1 class="font-bold text-4xl"
      >Connect with Us: Billing or Account Related Inquiries are Welcome</h1>
  {/if}
</div>
<div
  class="px-12 py-6 md:grid md:grid-cols-5 md:gap-x-10 lg:px-24 xl:px-32 xl:mr-32">
  <div class="md:col-span-3">
    <div class="text-xl mt-16 md:mt-12 font-bold">
      Get in Touch with <span class="text-emerald-600">Dr. Receipts</span></div>
    <div
      class:hidden={!invalid}
      class="my-4 p-4 col-span-1 md:col-span-2 flex flex-row gap-1 text-sm text-red-800 bg-red-100 rounded-lg"
      role="alert">
      <div class="w-5 h-5">
        <img src="exclaimation.svg" alt="Exclaimation Icon" draggable="false" />
      </div>

      <p class="grow">
        {alert}
      </p>
    </div>

    <div class="mt-4">Name<span class="text-red-500">*</span></div>
    <input
      readonly
      value={username}
      class="w-full px-2 h-10 rounded-lg border-2 text-gray-600 bg-gray-100" />

    <div class="mt-4">Type of Inquiry<span class="text-red-500">*</span></div>
    <select
      class="rounded-lg h-10 w-full bg-gray-100"
      bind:value={selectedInquiry}>
      {#each inquiryTypes as inquiry}
        <option value={inquiry}>
          {inquiry.text}
        </option>
      {/each}
    </select>
    <div class="mt-4">Tell us more<span class="text-red-500">*</span></div>
    <textarea
      placeholder="I require a change of email..."
      bind:value={inquiryDesc}
      class="resize-none w-full px-2 h-30 rounded-lg border-2 text-gray-600 bg-gray-100" />
    <div class="mt-4">
      <input
        bind:checked={commsAgree}
        type="checkbox"
        class="rounded mr-2"
        id="agree" /><label for="agree">
        I agree to receive communications from Dr. Receipts<span
          class="text-red-500">*</span
        ></label>
    </div>
    <button
      disabled={!commsAgree}
      on:click={submit}
      class="bg-emerald-600 text-white rounded-2xl px-6 py-2 mt-6">Send</button>

    <a
      href="/disputeHandling"
      class="mt-6 flex justify-center underline text-emerald-600"
      >Looking to file a receipt dispute instead?</a>
  </div>

  <div class="md:col-span-2">
    <div class="mt-12 font-bold text-xl"> Prefer to Contact Us Directly? </div>
    <div class="font-bold text-lg mt-6">General Inquiries</div>
    <div class="mt-6 text-lg text-emerald-500">
      <a href="mailto:general@drreceipts.com">general@drreceipts.com</a>
      <div>+65 9382 3928</div>
    </div>

    <div class="font-bold text-lg mt-6">Feedback and Suggestions</div>
    <div class="mt-6 text-lg text-emerald-500">
      <a href="mailto:feedback@drreceipts.com">feedback@drreceipts.com</a>
    </div>

    <div class="font-bold text-lg mt-6">Complaints</div>
    <div class="mt-6 text-lg text-emerald-500">
      <a href="mailto:complaints@drreceipts.com">complaints@drreceipts.com</a>
    </div>

    <div class="font-bold text-lg mt-6">Legal and Copyright</div>
    <div class="mt-6 text-lg text-emerald-500">
      <a href="mailto:legal@drreceipts.com">legal@drreceipts.com</a>
    </div>
  </div>
</div>
