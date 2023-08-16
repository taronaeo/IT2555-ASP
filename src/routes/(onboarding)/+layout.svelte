<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  const nextPage = $page.url.searchParams.get('next');

  $: (async () => {
    if ($authStore === null)
      return await goto(`/account/signin?next=${$page.url.pathname}`, {
        replaceState: true,
      });

    if ($authStore && $authStore.isOnboarded)
      return await goto(nextPage ?? '/', { replaceState: true });
  })();
</script>

{#if $authStore && !$authStore.isOnboarded}
  <slot />
{/if}
