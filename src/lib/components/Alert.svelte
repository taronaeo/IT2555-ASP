<script lang="ts">
  import { IconInfo } from '$lib/icons';
</script>

<div
  class="p-4 mb-4 flex flex-row bg-red-50 text-red-800 rounded-lg"
  role="alert">
  <IconInfo class="w-5 h-5" />
  <div class="ml-4 text-sm font-medium">
    <slot />
  </div>
</div>
