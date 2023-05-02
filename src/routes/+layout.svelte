<script lang="ts">
  import { FirebaseInit } from '$lib'
  import { auth, firestore } from '$lib/firebase'
</script>

<FirebaseInit {auth} {firestore}>
  <slot />
</FirebaseInit>
