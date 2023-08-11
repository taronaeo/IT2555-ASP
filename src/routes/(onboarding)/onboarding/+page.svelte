<script lang="ts">
  import FormUser from './FormUser.svelte';
  import FormVendor from './FormVendor.svelte';

  import { authStore } from '$lib/stores';
  import { AuthTenant } from '$lib/constants';
  import { Logo, LogoVendors } from '$lib/images';
</script>

<svelte:head>
  <title>Onboarding | Dr. Receipts</title>
</svelte:head>

<section
  class="flex flex-col gap-2 md:gap-8 min-h-screen
          before:min-h-[40px] before:md:flex-grow
          after:min-h-[40px] after:md:flex-grow">
  <div class="flex flex-row justify-center">
    {#if $authStore?.tenantId !== AuthTenant.VENDOR}
      <Logo class="h-8 md:h-10" />
    {:else}
      <LogoVendors class="h-8 md:h-10" />
    {/if}
  </div>

  {#if $authStore?.tenantId === AuthTenant.USER}
    <FormUser />
  {:else if $authStore?.tenantId === AuthTenant.VENDOR}
    <FormVendor />
  {/if}
</section>
