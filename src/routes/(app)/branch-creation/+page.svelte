<script lang="ts">
  import { firestore } from '$lib/firebase';
  import { collection, query, getDoc, doc, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';
  import { AniIconLoading } from '$lib/icons'

  import { onMount } from 'svelte';

  let userUid:string = ""

  if(!$authStore){
        goto('/')
    }
  else{
      userUid = $authStore.uid
  }

  async function get_vendor_id(){
    const userRef = doc(firestore, "users", userUid);
    const userSnapshot = await getDoc(userRef);
    let vendor_id = ""
    if (userSnapshot.exists()){
      vendor_id = userSnapshot.data()['vendorId'];
    }
    else{
      goto('/')
    }

    return vendor_id
    
  }
  let branches = [];
  let lastDoc = null;
  onMount(() => {
    loadBranches();
  })  

async function loadBranches() {
  const vendor_id = await get_vendor_id()
  const branchRef = collection(firestore, `vendors/${vendor_id}/branches`);
  const q = query(branchRef, orderBy('branchId', 'desc'), ...(lastDoc ? [startAfter(lastDoc)] : []), limit(6));
  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const data = docs.map(doc => doc.data());

  lastDoc = docs[docs.length - 1];
  branches = data;
}

  /*async function get_branches(){
    const vendor_id = await get_vendor_id();
    const branchRef = collection(firestore, `vendors/${vendor_id}/branches`);
    const q = query(branchRef, orderBy('branchId', 'desc'), ...(lastDoc ? [startAfter(lastDoc)] : []), limit(2));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    const data = docs.map(doc => doc.data());

    lastDoc = docs[docs.length - 1];
    branches = data;
  }
  function display_branches(){
    for (let i = start_index; i <= end_index; i++) {
      displayed_branches.push(branches[i]);
    }
    return displayed_branches
  }
  function next_page(){
    if(start_index>=final_index){
      return
    }
    start_index+=6

    for(let i = end_index; i<final_index; i++){end_index+=1}

    displayed_branches.length = 0;
    displayed_branches = displayed_branches;
    display_branches()
  } 
  function prev_page(){
    
    if((start_index-6)<0){
      return
    }
    start_index-=6;
    end_index = start_index+5
    displayed_branches.length = 0;
    displayed_branches = displayed_branches;
    console.log(displayed_branches)
    display_branches()*/
  

</script>

<div class="px-6">
  <p class="flex flex-row text-xl font-bold mb-4
    before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
    after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
    Create Branch
  </p>

    <div class="mb-6">
        <label for="email" class="block mb-2 text-md text-gray-900">Branch ID</label>
        <input
          placeholder="Enter the branch id..."
          class="p-2.5 w-full block
                  border border-gray-300 rounded-lg
                  bg-white text-gray-900 placeholder:text-gray-400
                  disabled:cursor-not-allowed disabled:opacity-75"
          required/>
    </div>
    <div class="mb-6">
        <label for="email" class="block mb-2 text-md text-gray-900">Branch Name</label>
        <input
          placeholder="Enter the branch name..."
          class="p-2.5 w-full block
                  border border-gray-300 rounded-lg
                  bg-white text-gray-900 placeholder:text-gray-400
                  disabled:cursor-not-allowed disabled:opacity-75"
          required/>
      </div>
      <div class="mb-6">
        <label for="email" class="block mb-2 text-md text-gray-900">Branch Location</label>
        <input
          placeholder="Enter the branch id..."
          class="p-2.5 w-full block
                  border border-gray-300 rounded-lg
                  bg-white text-gray-900 placeholder:text-gray-400
                  disabled:cursor-not-allowed disabled:opacity-75"
          required/>
      </div>
      <button
          type="submit"
          class="px-5 py-2.5 w-full rounded-lg
                  text-white text-center font-medium
                  bg-emerald-600 hover:bg-emerald-700
                  focus:outline-none focus:ring-4 focus:ring-green-300
                  disabled:cursor-not-allowed disabled:opacity-75 mb-6">
        Create Branch
      </button>

      
        <p class="flex flex-row text-xl font-bold mb-6
                before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
                after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
        Current Branches
        </p>
      <div class="grid grid-cols-2 text-sm gap-2">

          <div class="text-center col-span-2">
            <AniIconLoading class="m-auto my-12" fill="#059669"></AniIconLoading>
          </div>
            {#each branches as branch}
              <div class="border-2 p-2">
                <ul>
                  <li class="break-all">ID: {branch['branchId']}</li>
                  <li class="break-all">Location: {branch['branchLocation']}</li>
                  <li class="break-all">Postal Code: {branch['branchPostal']}</li>
                </ul>
              </div>
            {/each}
      </div>
      <div class="my-4">
        <div on:click="{loadBranches}" class="inline-block mt-4 mx-4">
          <img src="chevron-left.svg" class="h-8">
        </div>
        <div class="inline float-right mt-4 mx-4">
        <img src="chevron-right.svg" class=" h-8">
        </div>
      </div>
</div>