<script>
  import '../app.css';
  import { authStore } from '$lib/stores'
  import { AniIconLoading } from '$lib/icons'
</script>

{#if $authStore === undefined}
  <div
    class="z-50 fixed top-0 w-screen h-screen
            flex flex-col justify-center items-center">
    <AniIconLoading fill="#059669" />
  </div>
{:else}
  <slot />
{/if}
