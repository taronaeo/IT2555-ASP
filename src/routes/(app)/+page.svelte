<script>
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  import { AuthTenant } from '$lib/constants';
  import { signOut, continueAuth } from '$lib/firebase/auth';

  async function onSignOut() {
    await continueAuth(signOut);
    await goto('/account/signin');
  }
</script>

<svelte:head>
  <title>World of Digital Receipts | Dr. Receipts</title>
</svelte:head>

<section>
  <pre>{JSON.stringify($authStore, null, 2)}</pre>

  {#if $authStore !== null}
    <button on:click={onSignOut}>Logout</button>
  {/if}

  {#if $authStore?.tenantId === null}
    <h1>You're a normal user</h1>
  {:else if $authStore?.tenantId === AuthTenant.VENDOR}
    <h1>You're a tenant user</h1>
  {/if}

  <h1 class="text-4xl font-bold">Welcome to IT2555 - App Sec Project</h1>

  <h2>Junjie was here</h2>

  <h3>deziduck was here</h3>

  <h3> Trav was here </h3>

  <h3>Aaron was here</h3>

  <p>
    To check if SSR is ready, navigate to
    <a href="/api" class="text-blue-600 underline">/api</a>
  </p>
</section>
