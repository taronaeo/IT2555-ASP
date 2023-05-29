<script>
  import { page } from '$app/stores'
  import LoginPage from './Login.svelte';
  import RegisterPage from './Register.svelte';

  const { action } = $page.params
</script>

{#if action === 'login'}
  <LoginPage />
{:else if action === 'register'}
  <RegisterPage />
{/if}
