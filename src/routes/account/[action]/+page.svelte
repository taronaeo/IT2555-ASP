<script>
  import { page } from '$app/stores'
  import LoginPage from './Login.svelte';

  const { action } = $page.params
</script>

{#if action === 'login'}
  <LoginPage />
{:else}
  <h1>Register Page</h1>
{/if}
