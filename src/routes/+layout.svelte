<script>
  import '../app.css';

  import { Navbar } from '$lib'
  import { authStore } from '$lib/stores'
  import { AniIconLoading } from '$lib/icons'
</script>

<Navbar />

{#if $authStore === undefined}
  <div
    class="fixed top-0 w-screen h-screen
            flex flex-col justify-center items-center">
    <AniIconLoading fill="#059669" />
  </div>
{:else}
  <div class="mt-20 px-4 mx-auto container">
    <slot />
  </div>
{/if}

<!-- Footer should go here -->
