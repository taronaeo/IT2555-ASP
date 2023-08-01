<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  $: if ($authStore?.isOnboarded) goto('/');
</script>

{#if $authStore?.isOnboarded === false}
  <slot />
{/if}
