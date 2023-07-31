<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  $: if ($authStore) goto('/');
</script>

{#if !$authStore}
  <slot />
{/if}
