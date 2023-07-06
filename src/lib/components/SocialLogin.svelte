<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface $$Props extends HTMLButtonAttributes {}

  const btnClass = `
    px-5 py-2.5 w-full
    text-sm font-medium border rounded-lg
    inline-flex items-center justify-center gap-2
    hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-emerald-300
    disabled:cursor-not-allowed disabled:opacity-75
    ${$$props.class}
  `;
</script>

<button
  on:click
  on:focus
  on:mouseover
  on:mouseenter
  on:mouseleave
  class={btnClass}
  {...$$props}>
  <slot />
</button>
