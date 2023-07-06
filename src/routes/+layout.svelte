<script>
  import '../app.css';

  import { authStore } from '$lib/stores';
  import { AniIconLoading } from '$lib/icons';

  // Preload auth state
  $authStore;
</script>

{#if $authStore === undefined}
  <div
    class="z-50 fixed top-0 w-screen h-screen
            flex flex-col justify-center items-center">
    <AniIconLoading fill="#059669" class="w-20 h-20 aspect-1" />
  </div>
{:else}
  <slot />
{/if}
