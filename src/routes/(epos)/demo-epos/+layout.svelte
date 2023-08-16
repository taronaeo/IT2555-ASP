<script lang="ts">
  import { AuthGuard } from '$lib/components';
</script>

<AuthGuard>
  <slot />
</AuthGuard>
