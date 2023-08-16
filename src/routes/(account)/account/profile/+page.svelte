<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz@6..12&display=swap" rel="stylesheet">
<script>
  import { firestore } from '$lib/firebase';
  import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
  import { authStore } from '$lib/stores';

  function getInitials(name) {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  let user = {};
  let recentReceipts = [];
  const userUid = $authStore?.uid;

  async function getUser() {
    const docRef = doc(firestore, 'users', userUid)
    const docSnap = await getDoc(docRef);
    user = docSnap.data();
    return docSnap.data();
  };

  async function getRecentReceipts() {
    const receiptsRef = collection(firestore, 'receipts');
    const q = query(receiptsRef, where('userUid', '==', userUid), limit(5)); // Retrieve the 5 most recent receipts
    const querySnapshot = await getDocs(q);
    recentReceipts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  getUser().then(() => getRecentReceipts()); // Call the function after getting the user
</script>

{#await getUser()}
{:then}

<div class="container mx-auto px-4 md:px-0 max-w-3xl ">
  <!-- Profile section -->
    
  <div class="container mx-auto px-4 md:px-0 max-w-3xl ">
    <div class="flex flex-col md:flex-row items-center md:space-x-6 mt-10 relative">
        <div class="w-24 h-24 rounded-full flex items-center justify-center bg-emerald-200 text-2xl font-bold text-white">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50%" cy="50%" r="45%" fill="#34d399" />
                <text x="50%" y="50%" dy=".3em"  text-anchor="middle" fill="white" font-size="36px" font-family="Nunito Sans">
                  {getInitials(user.displayName)}
                </text>
            </svg>
        </div>
    <div class="md:ml-6 mt-6 md:mt-0">
        <h1 class="text-2xl font-semibold text-gray-800">{user.displayName}</h1>
        <h2 class="text-lg font-light text-gray-600">@{user.email}</h2>
        {#if user.phoneNumber == null}
        <p class="mt-2 text-gray-500">Phone Number: Not yet registered</p>
        {:else}
        <p class="mt-2 text-gray-500">Phone Number: {user.phoneNumber}</p>
        {/if}
        

        

    </div>
    <!-- Settings Button -->
    <a href="/settings" class="absolute top-10 right-0 md:right-4 p-2 rounded-full hover:bg-gray-100 transition duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        
    </a>
    </div>

  


</div>

  <!-- Recent Receipts section -->
  <div class="mt-10">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Receipts</h2>
    {#if recentReceipts.length > 0}
      <ul>
        {#each recentReceipts as receipt}
          <li class="border-b py-2">
            <div class="text-lg font-medium text-gray-800">{receipt.vendor.vendorName}</div>
            <div class="text-sm text-gray-500">Date: {receipt.date}</div>
            <div class="text-sm text-gray-500">Total Cost: ${receipt.subtotal}</div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-600">No recent receipts found.</p>
    {/if}
  </div>
</div>
{/await}