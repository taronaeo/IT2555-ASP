<script lang="ts">
  import { Alert } from '$lib/components';
  import { createForm } from 'svelte-forms-lib';

  import { FormInput } from '$lib/components';

  import { validateZod } from '$lib/forms';
  import { functions } from '$lib/firebase';
  import { httpsCallable } from 'firebase/functions';
  import { state, schema } from './FormVendor';

  const {
    form,
    errors,
    isValidating,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = createForm({
    initialValues: {
      vendorUen: '',
      vendorName: '',
      vendorCategory: '',
      vendorPhoneNumber: '',
    },
    validate: (data) => validateZod(schema, data),
    onSubmit: (data) => {
      const transformed = schema.parse(data);
      const onboardVendor = httpsCallable(
        functions,
        'onVendorOnboardingCallable'
      );

      return onboardVendor(transformed).catch(
        (err) => ($state.errorMessage = err)
      );
    },
  });
</script>

<div
  class="p-8 mx-auto w-full max-w-md
          flex flex-col gap-6 bg-white rounded-lg
          md:shadow md:border">
  <div class="text-center">
    <h1 class="text-xl md:text-2xl">Get onboard</h1>
    <span class="mt-2 text-sm md:text-base">
      Complete your profile to start using Dr. Receipts!
    </span>
  </div>

  {#if $state.errorMessage}
    <Alert>{$state.errorMessage}</Alert>
  {/if}

  <form class="space-y-4" on:submit|preventDefault={handleSubmit} novalidate>
    <FormInput
      id="vendorUen"
      type="text"
      label="What is your business UEN?"
      labelClass="font-medium text-sm text-gray-900"
      placeholder="E.g., 201809757C"
      errorMessage={$errors.vendorUen}
      disabled={$state.isLoading || $isValidating || $isSubmitting}
      on:change={handleChange}
      bind:value={$form.vendorUen} />

    <FormInput
      id="vendorName"
      type="text"
      label="What is your business name?"
      labelClass="font-medium text-sm text-gray-900"
      placeholder="Mah Ka Weng Inc"
      errorMessage={$errors.vendorName}
      disabled={$state.isLoading || $isValidating || $isSubmitting}
      on:change={handleChange}
      bind:value={$form.vendorName} />

    <div>
      <label
        for="vendorCategory"
        class="mb-2 block font-medium text-sm text-gray-900">
        Which category does your business belong to?
      </label>

      <select
        id="vendorCategory"
        name="vendorCategory"
        on:change={handleChange}
        bind:value={$form.vendorCategory}
        disabled={$state.isLoading || $isValidating || $isSubmitting}
        class="p-2.5 w-full block
                border border-gray-300 rounded-lg
                bg-white text-gray-900 placeholder:text-gray-400
                disabled:opacity-75 disabled:cursor-not-allowed">
        <option value="" selected>Choose a category</option>
        <option value="F&B">Food & Beverage</option>
        <option value="Transportation">Transportation</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
        <option value="Others">Others</option>
      </select>

      {#if $errors.vendorCategory}
        <small class="mt-2 block text-sm text-red-600">
          * {$errors.vendorCategory}
        </small>
      {/if}
    </div>

    <FormInput
      id="vendorPhoneNumber"
      type="tel"
      label="What is your business phone number?"
      labelClass="font-medium text-sm text-gray-900"
      placeholder="6123 4567"
      errorMessage={$errors.vendorPhoneNumber}
      disabled={$state.isLoading || $isValidating || $isSubmitting}
      on:change={handleChange}
      bind:value={$form.vendorPhoneNumber} />

    <div class="flex flex-row justify-end">
      <button
        type="submit"
        class="px-6 py-2 rounded
              text-sm text-white text-center font-medium
              bg-emerald-600 hover:bg-emerald-700
              focus:outline-none focus:ring-4 focus:ring-green-300
              disabled:opacity-75 disabled:cursor-not-allowed">
        Finish
      </button>
    </div>
  </form>
</div>
