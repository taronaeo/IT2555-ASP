<script lang="ts">
  import { onMount } from 'svelte';

  import { authStore } from '$lib/stores';
  import { firestore } from '$lib/firebase';
  import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
  import { createForm } from 'svelte-forms-lib';

  import { validateZod } from '$lib/forms';
  import { FormInput } from '$lib/components';
  import { state, schema } from './FormUser';

  onMount(() => {
    updateField('displayName', $authStore?.displayName);
    updateField('phoneNumber', $authStore?.phoneNumber);
  });

  const {
    form,
    errors,
    updateField,
    isValidating,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = createForm({
    initialValues: {
      displayName: '',
      phoneNumber: '',
    },
    validate: (data) => validateZod(schema, data),
    onSubmit: (data) => {
      const userRef = doc(firestore, `users/${$authStore?.uid}`);
      const transformed = schema.parse(data);

      return setDoc(userRef, {
        ...$authStore,
        ...transformed,
        isOnboarded: true,
        updatedAt: serverTimestamp(),
      }).catch((error) => console.error(error));
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

  <form class="space-y-4" on:submit|preventDefault={handleSubmit} novalidate>
    <FormInput
      id="displayName"
      type="text"
      label="What is your name?"
      placeholder="John Doe"
      autocomplete="given-name"
      on:change={handleChange}
      bind:value={$form.displayName}
      labelClass="font-medium text-sm text-gray-900"
      errorMessage={$errors.displayName} />

    <FormInput
      id="phoneNumber"
      type="tel"
      label="What is your phone number?"
      placeholder="8123 4567"
      autocomplete="tel"
      on:change={handleChange}
      bind:value={$form.phoneNumber}
      labelClass="font-medium text-sm text-gray-900"
      errorMessage={$errors.phoneNumber} />

    <div class="flex flex-row justify-end">
      <button
        type="submit"
        disabled={$state.isLoading || $isValidating || $isSubmitting}
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
