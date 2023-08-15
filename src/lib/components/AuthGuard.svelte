<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  import { authStore } from '$lib/stores';

  let nextPage = $page.url.searchParams.get('next') ?? '';

  $: (async () => {
    if (browser && $authStore === null) {
      // TODO: Add a toast to alert
      return await goto(`/account/signin?next=${$page.url.pathname}`, {
        replaceState: true,
      });
    }

    if (browser && $authStore && !$authStore.isOnboarded) {
      return await goto(`/onboarding?next=${$page.url.pathname}`, {
        replaceState: true,
      });
    }

    if (browser && $authStore && $authStore.isOnboarded) {
      return await goto(nextPage, { replaceState: true });
    }
  })();
</script>

{#if $authStore && $authStore.isOnboarded}
  <slot />
{/if}
