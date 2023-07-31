<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface $$Props extends HTMLInputAttributes {
    id: string;
    labelClass?: string;
    inputClass?: string;
    errorMessage: string;
  }

  let id = '';
  let labelClass = '';
  let inputClass = '';
  let errorMessage = '';

  const baseLabelClass = `
    ml-2 inline
    ${labelClass}
  `;

  const baseInputClass = `
    w-5 h-5 bg-white text-emerald-600
    border border-gray-300 rounded
    focus:ring-2 focus:ring-emerald-500
    ${inputClass}
  `;

  export { id, labelClass, inputClass, errorMessage };
</script>

<div>
  <input
    {id}
    name={id}
    type="checkbox"
    on:change
    class={baseInputClass}
    {...$$restProps} />

  <label for={id} class={baseLabelClass}>
    <slot />
  </label>

  {#if errorMessage}
    <small class="mt-2 block text-sm text-red-600">
      * {errorMessage}
    </small>
  {/if}
</div>
