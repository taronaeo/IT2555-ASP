<script lang="ts">
  export let onClickExecute: () => void = () => {};
  export let onClickCancel: () => void = () => {};
</script>

<div class="z-10 relative">
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
  <div class="z-10 fixed inset-0 overflow-y-auto">
    <div
      class="p-4 min-h-full text-center
              flex flex-row items-end justify-center
              sm:items-center sm:p-0">
      <div
        class="shadow-xl rounded-lg
              bg-white overflow-hidden transition-all
                sm:my-8 sm:w-full sm:max-w-lg">
        <div class="p-6 bg-white sm:text-left">
          <slot name="title" />

          <div class="mt-2">
            <slot name="body" />
          </div>
        </div>

        <div
          class="p-4 bg-gray-50
                  sm:flex sm:flex-row-reverse">
          <button
            on:click={onClickExecute}
            type="submit"
            class="px-3 py-2 w-full shadow-sm rounded-md
                    text-sm text-white font-semibold bg-red-600 hover:bg-red-500
                    inline-flex justify-center sm:ml-3 sm:w-auto">
            <slot name="buttonExecute" />
          </button>

          <button
            on:click={onClickCancel}
            type="button"
            class="mt-3 px-3 py-2 w-full shadow-sm rounded-md
                    text-sm font-semibold bg-white hover:bg-gray-50
                    ring-1 ring-inset ring-gray-300
                    inline-flex justify-center sm:mt-0 sm:w-auto">
            <slot name="buttonCancel" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
