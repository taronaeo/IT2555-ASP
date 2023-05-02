<script lang="ts">
  import type { Auth } from 'firebase/auth';
  import type { Firestore } from 'firebase/firestore';

  import { serviceStore } from '$lib/stores'

  export let auth: Auth;
  export let firestore: Firestore;
  serviceStore.set({ auth, firestore });
</script>

<slot />