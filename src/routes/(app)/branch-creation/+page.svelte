<script lang="ts">
  import { firestore } from '$lib/firebase';
  import { getDoc, doc, updateDoc, arrayRemove, query, where, getDocs, collection, arrayUnion, serverTimestamp } from 'firebase/firestore';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';
  import { AniIconLoading } from '$lib/icons';
  import { z } from 'zod';

  import crypto from 'crypto';
  let userUid:string = ""

  if(!$authStore){
        goto('/')
    }
  else{
      userUid = $authStore.uid
  }

  

  let branches = [];
  let displayed_branches = [];

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
let loaded = false;
async function loadBranches() {

  const vendor_id = await get_vendor_id();
  const vendorRef =  doc(firestore, "vendors", vendor_id);
    try {
    await getDoc(vendorRef)
  } catch (error) {
    goto('/')
    console.log("Forbidden")
  }
  const vendorSnap = await getDoc(vendorRef);
  const data = vendorSnap.data();
  data.branches.forEach(branch => {
    branches.push(branch)
  });
  final_index= branches.length-1;
  loaded = true;
  if(branches.length>=6){
    end_index=start_index+5;
  }
  else{
    end_index=final_index;
  }

}

let start_index:number = 0;
let end_index:number = 0;
let final_index = 0;

function get_branches(){
  displayed_branches.length = 0;
  for(let i = start_index; i <=end_index; i++){
    displayed_branches.push(branches[i])
  }
  displayed_branches = displayed_branches
}

function next_page(){
    if(start_index+6>=final_index){
      return
    }
    let differenceFinalEndIndex = final_index - end_index

    start_index+=6
    if(differenceFinalEndIndex>=6){
      for(let i = end_index; i<start_index+5; i++){end_index+=1}
    }
    else{
      for(let i = end_index; i<=final_index-1; i++){end_index+=1}
    }
    get_branches()

  } 
  function prev_page(){
    
    if((start_index-6)<0){
      return
    }
    start_index-=6;
    end_index = start_index+5;
    get_branches()
  }
  loadBranches().then(() => {get_branches()});

  let selectBranches:boolean = false;
  let manageKey: boolean = false;
  let managingBranchId:string = "";
  let managingBranchKey: string = "";
  let managingBranchSecret: string = "";
  let inputBranchId = "";
  let branchHasKey:boolean = false;
  let validRevoke: boolean = false;
  let validGeneration: boolean = false;
  let validDeletion: boolean = false;

  async function hasKey(branchId: string){
    manageKey = true;
    managingBranchId = branchId;
    const vendorId = await get_vendor_id();
    const vendorRef = doc(firestore, 'vendors', vendorId);
    const vendorSnap = await getDoc(vendorRef);
    const vendorData = vendorSnap.data();
    const apiKeys = vendorData.apiKeys
    apiKeys.forEach(key =>{
      if(key['branchId']===branchId){
        managingBranchKey = key['key'];
        managingBranchSecret = key['secret'];
        branchHasKey = true;
        return;
      }
    });
    return;
  }

  async function revokeKey(branchId: string){
    const vendorId = await get_vendor_id();
    const vendorRef = doc(firestore, 'vendors', vendorId);
    const vendorSnap = await getDoc(vendorRef);
    const vendorData = vendorSnap.data();
    const vendorApiKeys = vendorData.apiKeys;
    let branchKey: {branchId?: string; key?: string; secret?: string} =  {}
    vendorApiKeys.forEach(key => {
      if (key['branchId'] === branchId){
        branchKey = {
          branchId: branchId,
          key: key['key'],
          secret: key['secret']
        }
      updateDoc(vendorRef, {
        apiKeys: arrayRemove(branchKey)
      }).then(() => {window.location.reload()});
      return
      }
      else{
        return;
      }
    })
  }
  function validBranchIdRev(inputBranchId:string,branchId:string){
    if(inputBranchId===branchId){
      validRevoke = true;
      return
    }
    validRevoke = false;  
    return;
  }
  function validBranchIdGen(inputBranchId:string,branchId:string){
    if(inputBranchId===branchId){
      validGeneration = true;
      return
    }
    validGeneration = false;  
    return;
  }
  function validBranchIdDel(inputBranchId:string,branchId:string){
    if(inputBranchId===branchId){
      validDeletion = true;
      return
    }
    validDeletion = false;  
    return;
  }
  let inputCreationId:string = "";

  let inputCreationLocation:string = "";
  let inputCreationPostal: number | undefined = ""
  let invalid: boolean = false;
  let alert: string = "";

  const branchSchema = z.object({
    id: z
      .string()
      .min(2, 'ID must be at least 2 characters')
      .max(25, 'ID cannot exceed 15 characters')
      .refine(id => !id.includes(' '), 'ID cannot contain a space'),
    location: z.string().min(2, 'Location must be at least 2 characters'),
    postalCode: z.union([z.number(), z.string()]).refine(code => {
    const parsedCode = Number(code);
    return !isNaN(parsedCode) && parsedCode >= 100000 && parsedCode <= 999999;
  }, {
    message: 'Invalid postal code. Only valid 6-digit SG postal code allowed',
  }),
  });
  async function createBranch(){
    const inputBranches = branchSchema.safeParse({
      id: inputCreationId,
      location: inputCreationLocation,
      postalCode: inputCreationPostal
    });
    if(inputCreationId.length === 0 || inputCreationLocation.length === 0){
      invalid = true;
      alert = "Fill in all fields"
      return
    }
    if (!inputBranches.success) {
      invalid = true;
      alert = inputBranches.error.issues[0].message;
      return
    }
    const vendorId = await get_vendor_id();

    const vendorCol = collection(firestore, 'vendors');
    const vendorRef = doc(firestore, 'vendors', vendorId);

    let newBranch = {
      branchId: inputCreationId,
      branchLocation: inputCreationLocation,
      branchPostal: inputCreationPostal
    }
    
    const q = query(vendorCol,
    where("vendorId", "==", vendorId),
    where("branches", "array-contains", {
      branchId: inputCreationId,
      branchLocation: inputCreationLocation,
      branchPostal: inputCreationPostal
    }))
    const querySnap = await getDocs(q);
    
    if(querySnap.docs.length === 0){
      updateDoc(vendorRef, {
        branches: arrayUnion(newBranch),
        branchCreatedAt: serverTimestamp(),
      }).then(() => {window.location.reload()});
      return;
    }
    else{
      invalid = true;
      alert = "Branch already exists!"
      return
    }
    
  }

  async function genApiKey(branchId: string){
    const length = 16;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+?/|';
    let apiKey = '';
    let apiSecret = '';
    const charactersLength = characters.length;
    const randomValues1 = new Uint8Array(length);
    const randomValues2 = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues1)
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(randomValues1[i] / 256 * charactersLength);
      apiKey += characters.charAt(randomIndex);
    }
    window.crypto.getRandomValues(randomValues2)
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(randomValues2[i] / 256 * charactersLength);
      apiSecret += characters.charAt(randomIndex);
    }
    const vendorId = await get_vendor_id();
    const vendorRef = doc(firestore, 'vendors', vendorId);
    const newApiKey = {
      branchId: branchId,
      key: apiKey,
      secret: apiSecret,
    }
    updateDoc(vendorRef, {
        apiKeys: arrayUnion(newApiKey)
      }).then(() => {window.location.reload()});
    return;
    }

  let deleting = false;
  async function deleteBranch(branchId: string){
    const vendorId = await get_vendor_id();
    const vendorRef = doc(firestore, 'vendors', vendorId);
    const vendorSnap = await getDoc(vendorRef);
    const vendorData = vendorSnap.data();
    const vendorBranches = vendorData.branches;
    let branch: {branchId?: string; branchLocation?: string; branchPostal?: number} =  {}
    vendorBranches.forEach(element => {
      if (element['branchId'] === branchId){
        branch = {
          branchId: branchId,
          branchLocation: element['branchLocation'],
          branchPostal: element['branchPostal']
        }
      updateDoc(vendorRef, {
        branches: arrayRemove(branch)
      }).then(() => {window.location.reload()});
      return
      }
      else{
        return;
      }
    })
  }
  
  function hasWhiteSpace(branchId) {
    return /\s/g.test(branchId);
  }


</script>

<div class="px-6 md:w-2/3 m-auto ">
  <div>
        <p class="flex flex-row text-xl font-bold mb-6 md:mx-8
                before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
                after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
        Current Branches
        </p>
        <button on:click={()=>{
          if(!selectBranches){
            selectBranches=true
          }
          else{
            selectBranches = false;
          }
          }} class="border-2 border-emerald-600 rounded-full w-full py-3 transition hover:bg-emerald-600 hover:text-white mb-6">
          Manage Branches and Respective API Keys
        </button>
      <div class="grid grid-cols-2 text-sm gap-2">
            {#if !loaded}
              <div class="text-center col-span-2">
                <AniIconLoading class="m-auto my-12" fill="#059669"></AniIconLoading>
              </div>

            {:else}
              {#each displayed_branches as branch}
                <button role="button" disabled={!selectBranches} class:bg-slate-200={selectBranches} on:click={()=>{hasKey(branch['branchId']);inputBranchId="";validRevoke=false;validGeneration=false;}} class="flex flex-col text-left border-2 p-2">
                  <ul>
                    <li class="break-all"><span class="font-bold">ID:</span> {branch['branchId']}</li>
                    <li class="break-all"><span class="font-bold">Location:</span> {branch['branchLocation']}</li>
                    <li class="break-all"><span class="font-bold">Postal Code:</span> {branch['branchPostal']}</li>
                  </ul>
                </button>
              {/each}

            {/if}
      </div>
      <div class="my-4">
        <div on:click="{prev_page}" class="inline-block mt-4 mx-4">
          <img src="chevron-left.svg" class="h-8">
        </div>
        <div on:click ="{next_page}" class="inline float-right mt-4 mx-4">
        <img src="chevron-right.svg" class=" h-8">
        </div>
      </div>

      <div class:hidden={!manageKey} class="flex fixed justify-center items-center inset-0 w-full bg-black/50">
        {#if !branchHasKey}
        
          <div class:hidden={deleting} class="text-center text-md py-2 w-10/12 md:w-2/3 lg:w-2/3 xl:w-1/3 px-4 font-bold bg-white  border-2">
            <p>
            No API Key or Secret Created Yet.
            </p>
            <p class=" flex flex-row font-normal md:mx-8
                  before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
                  after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
              Generate API Key for:
            </p>
            <div class="text-center text-lg mb-2">{managingBranchId}</div>
            <div class="text-center">
              <div class="font-normal text-md mb-2">Type in Branch ID to confirm <span class="font-bold">Generation</span></div>
              <input bind:value={inputBranchId} on:input={()=>{validBranchIdGen(inputBranchId,managingBranchId)}} class="mb-4 border-2 w-3/4">
            </div>
            <button 
                  disabled={!validGeneration}
                  on:click={()=>{genApiKey(managingBranchId)}}
                  class="px-5 py-2.5 rounded-lg
                          text-white text-center font-medium
                          bg-emerald-600 hover:bg-emerald-700
                          focus:outline-none focus:ring-4 focus:ring-green-300
                          disabled:cursor-not-allowed disabled:opacity-75">
                Generate
              </button>
              <button 
                  on:click={() => {manageKey = false;branchHasKey=false;validGeneration=false;}}
                  class="px-5 py-2.5 rounded-lg border-2
                          text-emerald-600 text-center font-medium
                          bg-white hover:bg-emerald-600
                          border-emerald-600 hover:text-white
                          focus:outline-none focus:ring-4 focus:ring-green-300
                          disabled:cursor-not-allowed disabled:opacity-75">
                Cancel
              </button>

              <p class=" flex flex-row font-normal md:mx-8 my-2
              before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
              after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
              Manage Branches
              </p>

              <button 

            on:click={()=>{deleting=true;}}
            class="px-5 py-2.5 rounded-lg border-2 mb-2
                    bg-emerald-600 text-white
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    disabled:cursor-not-allowed disabled:opacity-75">
              Manage Delete
            </button>

          </div>

          <div class:hidden={!deleting} class="text-center text-md py-2 w-10/12 md:w-2/3 lg:w-2/3 xl:w-1/3 px-4 font-bold bg-white  border-2">
            <p class=" flex flex-row font-normal my-4 md:mx-8 
            before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
            after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
              Delete Branch
            </p>
            <div class="mb-4">{managingBranchId}</div>
            <div class="text-center">
              <div class="font-normal text-md mb-2">Type in Branch ID to confirm <span class="font-bold">Deletion</span></div>
              <input bind:value={inputBranchId} on:input={()=>{validBranchIdDel(inputBranchId,managingBranchId)}} class="mb-4 border-2 w-3/4">
            </div>
            <button 
            disabled={!validDeletion}
            on:click={()=>{deleteBranch(managingBranchId)}}
            class="px-5 py-2.5 rounded-lg border-2 mb-2
                    bg-orange-600 text-white
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    disabled:cursor-not-allowed disabled:opacity-75">
              Delete Branch
            </button>

            <button 
            on:click={() => {deleting = false;branchHasKey=false;validDeletion=false;}}
            class="px-5 py-2.5 rounded-lg border-2
                    text-emerald-600 text-center font-medium
                    bg-white hover:bg-emerald-600
                    border-emerald-600 hover:text-white
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    disabled:cursor-not-allowed disabled:opacity-75">
            Cancel
            </button>
          </div>
          {:else}
          <div class:hidden={deleting} class="p-4 w-10/12 md:w-2/3 lg:w-2/3 xl:w-1/3 font-bold bg-white  border-2">
            <p class="flex flex-row font-normal
                  before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
                  after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
              Revoke API Key for:
            </p>
            <div class="text-center text-lg">{managingBranchId}</div>
            <div class="border-2 border-gray-600 py-1 px-2 mt-2 mb-6 mx-1 md:mx-4">
            <div class="font-normal italic"><span class="font-bold not-italic">API Key: </span>{managingBranchKey}</div>
            <div class="font-normal italic"><span class="font-bold not-italic">API Secret: </span>{managingBranchSecret}</div>
            </div>

            <div class="text-center mt-2">
              <div class="font-normal">Type in Branch ID to confirm <span class="font-bold">Revokation</span></div>
              <input bind:value={inputBranchId} on:input={()=>{validBranchIdRev(inputBranchId,managingBranchId)}} class="mb-4 mt-2 border-2 w-3/4">
            </div>
            <div class="text-center">
              <button 
                  disabled={!validRevoke}
                  on:click={() => {revokeKey(managingBranchId)}}
                  class="px-5 py-2.5 rounded-lg
                          text-white text-center font-medium
                          bg-emerald-600 hover:bg-emerald-700
                          focus:outline-none focus:ring-4 focus:ring-green-300
                          disabled:cursor-not-allowed disabled:opacity-75">
                Revoke
              </button>
              <button 
                  on:click={() => {manageKey = false;branchHasKey=false;}}
                  class="px-5 py-2.5 rounded-lg border-2
                          text-emerald-600 text-center font-medium
                          bg-white hover:bg-emerald-600
                          border-emerald-600 hover:text-white
                          focus:outline-none focus:ring-4 focus:ring-green-300
                          disabled:cursor-not-allowed disabled:opacity-75">
                Cancel
              </button>
              
              <p class=" flex flex-row font-normal md:mx-8 my-4
              before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
              after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
              Manage Branches
              </p>

              <button 

            on:click={()=>{deleting=true;}}
            class="px-5 py-2.5 rounded-lg border-2 mb-2
                    bg-emerald-600 text-white
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    disabled:cursor-not-allowed disabled:opacity-75">
              Manage Delete
            </button>
            </div>
            
          </div>
          <div class:hidden={!deleting} class="text-center text-md py-2 w-10/12 md:w-2/3 lg:w-2/3 xl:w-1/3 px-4 font-bold bg-white  border-2">
            <p class=" flex flex-row font-normal my-4 md:mx-8 
            before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
            after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
              Delete Branch
            </p>
            <div class="mb-4">{managingBranchId}</div>
            <div class="text-center">
              <div class="font-normal text-md mb-2">Type in Branch ID to confirm <span class="font-bold">Deletion</span></div>
              <input bind:value={inputBranchId} on:input={()=>{validBranchIdDel(inputBranchId,managingBranchId)}} class="mb-4 border-2 w-3/4">
            </div>
            <button 
            disabled={!validDeletion}
            on:click={()=>{deleteBranch(managingBranchId)}}
            class="px-5 py-2.5 rounded-lg border-2 mb-2
                    bg-orange-600 text-white
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    disabled:cursor-not-allowed disabled:opacity-75">
              Delete Branch
            </button>

            <button 
            on:click={() => {deleting = false;validDeletion=false;}}
            class="px-5 py-2.5 rounded-lg border-2
                    text-emerald-600 text-center font-medium
                    bg-white hover:bg-emerald-600
                    border-emerald-600 hover:text-white
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    disabled:cursor-not-allowed disabled:opacity-75">
            Cancel
            </button>
          </div>
        {/if}

      </div>

  </div>
  <div>

    <p class="flex flex-row text-xl font-bold mb-4
      before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-400
      after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-400">
      Create Branch
    </p>
    <div class:hidden={!invalid} class="mb-4 p-4 col-span-1 md:col-span-2 flex flex-row gap-1 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
      <div class="w-5 h-5">
        <img src="exclaimation.svg" alt="Exclaimation Icon" draggable="false">
      </div>
  
      <p class="grow">
        {alert}
      </p>
    </div>
      <div class="mb-6">
          <label for="email" class="block mb-2 text-md text-gray-900">Branch ID</label>
          <input
            bind:value={inputCreationId}
            placeholder="Enter the branch id..."
            class="p-2.5 w-full block
                    border border-gray-300 rounded-lg
                    bg-white text-gray-900 placeholder:text-gray-400
                    disabled:cursor-not-allowed disabled:opacity-75"
            required/>
      </div>
        <div class="mb-6">
          <label for="email" class="block mb-2 text-md text-gray-900">Branch Location</label>
          <input
            bind:value={inputCreationLocation}
            placeholder="Enter the branch location..."
            class="p-2.5 w-full block
                    border border-gray-300 rounded-lg
                    bg-white text-gray-900 placeholder:text-gray-400
                    disabled:cursor-not-allowed disabled:opacity-75"
            required/>
        </div>
        <div class="mb-6">
          <label for="email" class="block mb-2 text-md text-gray-900">Branch Postal Code</label>
          <input
            bind:value={inputCreationPostal}
            placeholder="Enter the branch postal code..."
            class="p-2.5 w-full block
                    border border-gray-300 rounded-lg
                    bg-white text-gray-900 placeholder:text-gray-400
                    disabled:cursor-not-allowed disabled:opacity-75"
            required/>
        </div>
        <button
            on:click={()=>{createBranch()}}
            class="px-5 py-2.5 w-full rounded-lg
                    text-white text-center font-medium
                    bg-emerald-600 hover:bg-emerald-700
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    disabled:cursor-not-allowed disabled:opacity-75 mb-6">
          Create Branch
        </button>
  
    </div>
</div>