<script>
    import { firestore } from '$lib/firebase';
    import { query, getDocs, limit, startAfter, collection, orderBy } from 'firebase/firestore';
    import { onMount } from 'svelte';

    let branches = [];
    let lastDoc = null;

    const ref = collection(firestore, `vendors/FairPriceNTUC/branches`);

    onMount(() => {
        loadBranches();
    })

    async function loadBranches() {
        const q = query(ref, orderBy('branchId', 'desc'), ...(lastDoc ? [startAfter(lastDoc)] : []), limit(2));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;
        const data = docs.map(doc => doc.data());

        lastDoc = docs[docs.length - 1];
        branches = data;
    }
</script>


{#each branches as branch}
<div>branchId:{branch['branchId']}</div>
<div>branchLocation:{branch['branchLocation']}</div>
<div>branchPostal:{branch['branchPostal']}</div><br>
{/each}

<button on:click={loadBranches}>Load next set</button>