<script lang="ts">
  import './styles.css';
  import '@fontsource/dm-sans';

  import { FirebaseInit } from '$lib';
  import { auth, firestore } from '$lib/firebase';
</script>

<FirebaseInit {auth} {firestore}>
  <div class="p-4 mx-auto container">
    <slot />
  </div>
</FirebaseInit>
