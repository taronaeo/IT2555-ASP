<script lang="ts">
  import type { Auth, User } from 'firebase/auth'
  import { serviceStore, userStore } from '$lib/stores'

  interface $$Slots {
    default: { user: User }
    signedOut: {}
  }

  export let auth: Auth = $serviceStore.auth;
  export let user = userStore(auth);
</script>

{#if $user}
  <slot user={$user} />
{:else}
  <slot name="signedOut" />
{/if}
