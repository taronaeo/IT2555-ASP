<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface $$Props extends HTMLInputAttributes {
    id: string;
    label: string;
    labelClass?: string;
    inputClass?: string;
    errorMessage: string;
  }

  let id = '';
  let label = '';
  let labelClass = '';
  let inputClass = '';
  let errorMessage = '';

  const baseLabelClass = `
    mb-2 block
    ${labelClass}
  `;

  const baseInputClass = `
    p-2.5 w-full block
    border border-gray-300 rounded-lg
    bg-white text-gray-900 placeholder:text-gray-400
    disabled:opacity-75 disabled:cursor-not-allowed
    ${inputClass}
  `;

  const errorInputClass = `
    text-red-600 border-red-300
    placeholder:text-red-300
    focus:ring-red-600 focus:border-red-600
  `;

  export { id, label, labelClass, inputClass, errorMessage };
</script>

<div>
  <label for={id} class={baseLabelClass}>
    {label}
  </label>

  <input
    {id}
    name={id}
    on:change
    class="{baseInputClass} {errorMessage && errorInputClass}"
    {...$$restProps} />

  {#if errorMessage}
    <small class="mt-2 block text-sm text-red-600">
      * {errorMessage}
    </small>
  {/if}
</div>
