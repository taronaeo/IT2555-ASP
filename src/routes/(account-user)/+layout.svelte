<script lang="ts">
  import { AuthTenant } from '$lib/constants';

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  const nextPage = $page.url.searchParams.get('next');

  $: (async () => {
    if ($authStore && nextPage)
      return await goto(nextPage, { replaceState: true });

    if ($authStore && $authStore.tenantId !== AuthTenant.USER)
      return await goto('/', { replaceState: true });

    if ($authStore && $authStore.isOnboarded)
      return await goto('/dashboard', { replaceState: true });

    if ($authStore && !$authStore.isOnboarded)
      return await goto('/onboarding', { replaceState: true });
  })();
</script>

{#if $authStore === null}
  <slot />
{/if}
