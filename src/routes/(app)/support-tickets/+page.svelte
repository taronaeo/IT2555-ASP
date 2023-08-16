<script lang="ts">
  import { firestore } from '$lib/firebase';
  import {
    QueryDocumentSnapshot,
    collection,
    doc,
    endBefore,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    updateDoc,
    where,
  } from 'firebase/firestore';
  import dayjs from 'dayjs';
  import { onMount } from 'svelte';

  import type { DocumentData, FieldValue } from 'firebase/firestore';
  import type { SupportTicket } from '$lib/models/SupportTicket';
  import type { User } from '$lib/models';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  $: {
    selectTypeTrim = selectType.trim();
  }

  if (!$authStore) {
    goto('/account/signin');
  }

  if ($authStore!.tenantId !== 'support-uxfrz') {
    goto('/');
  }

  const userUid = $authStore!.uid;

  const userRef = doc(firestore, 'users', userUid);
  getDoc(userRef)
    .then((doc) => {
      const data = doc.data();
      if (data!.tenantId !== 'support-uxfrz') {
        goto('/account/signin');
      }
    })
    .catch((err) => console.error(err));

  onMount(() => {
    getTickets();
  });

  const ticketTypes: { id: number; text: string }[] = [
    { id: 1, text: 'Password Change' },
    { id: 2, text: 'Email Change' },
    { id: 3, text: 'Phone Number Change' },
    { id: 4, text: 'Billing Issue' },
    { id: 5, text: 'Others' },
    { id: 6, text: 'Clear Filter' },
  ];

  interface UserTicketInfo extends SupportTicket {
    userName: string;
    userEmail: string;
  }

  const supportTicketRef = collection(firestore, 'supportTickets');

  let tickets: SupportTicket[] = [];

  let selectType: string = '';
  let selectTypeTrim: string = '';

  let firstDoc: QueryDocumentSnapshot<DocumentData> | null;
  let lastDoc: QueryDocumentSnapshot<DocumentData> | null;

  let resolvingTicket: boolean = false;
  let examiningTicket: boolean = false;
  let resolvingTicketId: string = '';
  let examiningTicketId: string = '';
  let examiningUserUid: string = '';

  function isBlank(str: string): boolean {
    return !str.trim();
  }

  async function getTickets() {
    let q;
    if (isBlank(selectType) || selectTypeTrim === 'Clear Filter') {
      q = query(
        supportTicketRef,
        orderBy('createdAt'),
        where('isResolved', '==', false),
        ...(firstDoc ? [endBefore(firstDoc)] : []),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(9)
      );
    } else {
      q = query(
        supportTicketRef,
        where('inquiryType', '==', selectTypeTrim),
        where('isResolved', '==', false),
        orderBy('createdAt'),
        ...(firstDoc ? [endBefore(firstDoc)] : []),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(9)
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
    tickets = data as SupportTicket[];
  }

  async function paginateNext(): Promise<void> {
    firstDoc = null;
    await getTickets();
  }

  async function paginateBack(): Promise<void> {
    lastDoc = null;
    await getTickets();
  }

  function convertToDate(createdAt: FieldValue): string {
    // @ts-ignore
    const date = dayjs(createdAt.toMillis()).format('YYYY/MM/DD');
    return date;
  }

  async function getTicketDetails(): Promise<UserTicketInfo> {
    const ticketRef = doc(firestore, 'supportTickets', examiningTicketId);
    const userRef = doc(firestore, 'users', examiningUserUid);

    const ticketSnap = await getDoc(ticketRef);
    const userSnap = await getDoc(userRef);

    const ticketData = ticketSnap.data() as SupportTicket;
    const userData = userSnap.data() as User;

    const userTicketInfoData: UserTicketInfo = {
      ticketId: ticketData.ticketId,
      inquiryDesc: ticketData.inquiryDesc,
      inquiryType: ticketData.inquiryType,
      createdAt: ticketData.createdAt,
      isResolved: ticketData.isResolved,
      userUid: userData.uid,
      userName: userData.displayName!,
      userEmail: userData.email!,
    };
    console.log(userTicketInfoData);
    return userTicketInfoData;
  }
  async function markResolved(): Promise<void> {
    const ticketRef = doc(firestore, 'supportTickets', resolvingTicketId);
    await updateDoc(ticketRef, {
      isResolved: true,
    }).catch((err) => {
      console.error(`Error deleting vendor ${resolvingTicketId}, ${err}`);
    });
    window.location.reload();
  }
</script>

<div
  class:hidden={!resolvingTicket}
  class="flex fixed justify-center items-center inset-0 w-full bg-black/50 z-10">
  <div class="text-center text-md py-2 w-1/3 px-4 bg-white border-2">
    Mark Ticket ID as Resolved: <span class="font-bold text-emerald-500"
      >{resolvingTicketId}</span>
    <hr
      class="border-[1px] w-4/5 m-auto mt-1 mb-2 border-gray-300 border-dashed" />
    <div class="font-bold">WARNING: This Action Cannot be Undone</div>
    <div class="mt-4">
      <button
        on:click={() => {
          markResolved();
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
          resolvingTicket = false;
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
  class:hidden={!examiningTicket}
  class="flex fixed justify-center items-center inset-0 w-full bg-black/50 z-10">
  <div class="text-center text-md py-2 w-1/3 px-4 bg-white border-2">
    Ticket ID: <span class="font-bold text-emerald-500"
      >{examiningTicketId}</span>
    <hr
      class="border-[1px] w-4/5 m-auto mt-1 mb-3 border-gray-300 border-dashed" />

    <div class="flex flex-row ml-4">
      <div class="flex flex-col text-left">
        <div class="w-24">
          <div>User UID</div>
          <div>User Name</div>
          <div>User Email</div><br />
          <div>Inquiry Date</div>
          <div>Inquiry Type</div>
          <div>Description</div>
        </div>
      </div>

      <div class="flex flex-col font-bold text-left text-emerald-500 mx-4">
        {#if !isBlank(examiningTicketId)}
          {#await getTicketDetails() then ticket}
            <div>{ticket.userUid}</div>
            <div>{ticket.userName}</div>
            <div>{ticket.userEmail}</div><br />
            <div>{convertToDate(ticket.createdAt)}</div>
            <div>{ticket.inquiryType}</div>
            <div class="break-all">{ticket.inquiryDesc}</div>
          {/await}
        {/if}
      </div>
    </div>
    <button
      on:click={() => {
        examiningTicket = false;
      }}
      class="px-5 py-2 rounded-lg text-sm mt-4
            text-white text-center font-medium
            border-2 border-emerald-600
            bg-emerald-600 hover:bg-emerald-700
            focus:outline-none focus:ring-4 focus:ring-green-300
            disabled:cursor-not-allowed disabled:opacity-75">
      Back
    </button>
  </div>
</div>

<div class="w-3/4 m-auto pt-10">
  <div class="leading-8">
    <div class="font-bold text-3xl"> Get Started with Support Tickets </div>
    <div>
      Check out the support tickets here and press 'Examine' to look at the
      details and reach out to user. 'Mark as Resolved' after inquiry has been
      resolved.
    </div>
    <div>
      Do remember to clarify with users via email/SMS before marking as
      resolved.
    </div>
    <div>
      Manage the vendors using the
      <button
        on:click={() => {
          goto('/support-dashboard');
        }}
        class="text-emerald-600"
        >vendor support dashboard <img
          src="arrow-icon.svg"
          alt="right arrow"
          class="h-5 inline ml-1 mt-[1px]" /></button>
      <div>
        <div class="mt-6 flex flex-row">
          <button
            on:click={() => {
              paginateBack();
            }}
            class="bg-emerald-500 h-7 px-3
            text-white rounded-l text-sm">Filter</button>
          <select
            on:change={() => {
              getTickets();
            }}
            bind:value={selectType}
            class="py-0 h-7 border-l-0 rounded-r text-sm">
            {#each ticketTypes as type}
              <option>
                {type.text}
              </option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="font-bold text-xl mt-6">Support Tickets</div>
  <div class="grid grid-cols-3 gap-3 mt-2">
    {#if tickets.length === 0}
      <div
        class="col-span-3 border-2 w-fit px-2 rounded text-emerald-600 font-bold ml-4"
        >No tickets created yet</div>
    {/if}
    {#each tickets as ticket}
      <div class="border-2 rounded h-36 p-4 truncate">
        <div class="flex-row flex justify-between">
          <div>
            <div class="font-bold text-emerald-600">{ticket.ticketId}</div>
            <div class="text-xs text-gray-700"
              >{convertToDate(ticket.createdAt)}</div>
            <div class="text-gray-800 text-sm mt-2">{ticket.inquiryDesc}</div>
            <div class="mt-4">
              <button
                on:click={() => {
                  examiningTicketId = ticket.ticketId;
                  examiningUserUid = ticket.userUid;
                  examiningTicket = true;
                }}
                class="bg-emerald-600 text-white px-2 py-1 rounded mr-1"
                >Examine</button>
              <button
                on:click={() => {
                  resolvingTicket = true;
                  resolvingTicketId = ticket.ticketId;
                }}
                class="bg-emerald-600 text-white px-2 py-1 rounded"
                >Mark as Resolved</button>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="mb-12 mt-2">
    <button on:click={paginateBack} class="float-left ml-12"
      ><img src="chevron-left.svg" alt="right arrow" class="mt-2" /></button>

    <button on:click={paginateNext} class="float-left ml-24"
      ><img src="chevron-right.svg" alt="right arrow" class="mt-2" /></button>
  </div>
</div>
