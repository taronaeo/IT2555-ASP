<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  $: {
    if ($authStore === null) goto('/');
    if ($authStore && $authStore.isOnboarded) goto('/');
  }
</script>

{#if $authStore?.isOnboarded === false}
  <slot />
{/if}
