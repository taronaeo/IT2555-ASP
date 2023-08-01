<script lang="ts">
  import { AuthTenant } from '$lib/constants';

  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  $: {
    if ($authStore && $authStore.tenantId !== AuthTenant.VENDOR) goto('/');
    if ($authStore && $authStore.isOnboarded) goto('/dashboard');
    if ($authStore && !$authStore.isOnboarded) goto('/onboarding');
  }
</script>

{#if $authStore === null}
  <slot />
{/if}
