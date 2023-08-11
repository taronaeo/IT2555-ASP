<script lang="ts">
  import { AniIconLoading } from '$lib/icons';
  import { Alert, FormInput } from '$lib/components';
  import {
    state,
    form,
    errors,
    isValidating,
    isSubmitting,
    handleChange,
    handleSubmit,
  } from './FormVendor';
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

    <FormInput
      id="cardNumber"
      type="number"
      label="Card Number"
      labelClass="font-medium text-sm text-gray-900"
      placeholder="4242 4242 4242 4242"
      errorMessage={$errors.cardNumber}
      disabled={$state.isLoading || $isValidating || $isSubmitting}
      on:change={handleChange}
      bind:value={$form.cardNumber} />

    <FormInput
      id="cardExpMonth"
      type="number"
      label="Card Expiry Month"
      labelClass="font-medium text-sm text-gray-900"
      placeholder="08"
      errorMessage={$errors.cardExpMonth}
      disabled={$state.isLoading || $isValidating || $isSubmitting}
      on:change={handleChange}
      bind:value={$form.cardExpMonth} />

    <FormInput
      id="cardExpYear"
      type="number"
      label="Card Expiry Year"
      labelClass="font-medium text-sm text-gray-900"
      placeholder="2023"
      errorMessage={$errors.cardExpYear}
      disabled={$state.isLoading || $isValidating || $isSubmitting}
      on:change={handleChange}
      bind:value={$form.cardExpYear} />

    <FormInput
      id="cardCvc"
      type="number"
      label="Card CVC"
      labelClass="font-medium text-sm text-gray-900"
      placeholder="314"
      errorMessage={$errors.cardCvc}
      disabled={$state.isLoading || $isValidating || $isSubmitting}
      on:change={handleChange}
      bind:value={$form.cardCvc} />

    <div class="flex flex-row justify-end">
      <button
        type="submit"
        disabled={$state.isLoading || $isValidating || $isSubmitting}
        class="px-6 py-2 rounded
              text-sm text-white text-center font-medium
              bg-emerald-600 hover:bg-emerald-700
              focus:outline-none focus:ring-4 focus:ring-green-300
              disabled:opacity-75 disabled:cursor-not-allowed">
        {#if !($state.isLoading || $isValidating || $isSubmitting)}
          Finish
        {:else}
          <AniIconLoading class="w-6 h-6 mx-auto" fill="#fff" />
        {/if}
      </button>
    </div>
  </form>
</div>
