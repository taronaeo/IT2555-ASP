<script lang="ts">
  import { Logo } from '$lib/images';
  import { IconGoogle, IconMicrosoft, AniIconLoading } from '$lib/icons';

  import { Alert } from '$lib/components';
  import { createForm } from 'svelte-forms-lib';
  import { schemaRegister, validateZod } from '$lib/forms';

  import { auth } from '$lib/firebase';
  import {
    AuthErrorCodes,
    setPersistence,
    indexedDBLocalPersistence,
    createUserWithEmailAndPassword,
  } from 'firebase/auth';

  let firebaseError = '';

  async function signUpEmailPassword(email: string, password: string) {
    try {
      await setPersistence(auth, indexedDBLocalPersistence);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      switch (error.code) {
        case AuthErrorCodes.EMAIL_EXISTS:
          firebaseError = 'Email already exists, login instead?';
          break;
        default:
          firebaseError = 'Something went wrong, please try again in a while';
          break;
      }

      console.error(error);
    }
  }

  const {
    form,
    errors,
    isValidating,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = createForm({
    initialValues: {
      email: '',
      password: '',
      password_confirm: '',
    },
    validate: (values) => validateZod(schemaRegister, values),
    onSubmit: ({ email, password }) => signUpEmailPassword(email, password),
  });
</script>

<!-- TODO: Why is this not showing on mobile? -->
<!--        Chrome and Firefox are not displaying it -->
<!--        Safari is displaying it for some reason -->
<div class="max-w-lg w-full block md:hidden">
  <a href="/">
    <Logo class='py-4 h-20 mx-auto' />
  </a>
</div>

<div class="bg-white rounded-lg md:shadow md:border">
  <div class="p-4 space-y-6 md:p-6">
    <h1
      class="text-xl text-center text-gray-900
              font-bold md:text-left md:text-2xl">
      Create your account
    </h1>

    <div class="flex flex-col gap-2 md:flex-row">
      <button
        class="btn-social"
        disabled={$isValidating || $isSubmitting}>
        <IconGoogle class="w-5 h-5 aspect-1" />
        Sign up with Google
      </button>

      <button
        class="btn-social"
        disabled={$isValidating || $isSubmitting}>
        <IconMicrosoft class="w-5 h-5 aspect-1" />
        Sign up with Microsoft
      </button>
    </div>

    <p
      class="flex flex-row text-center text-gray-500
              before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-200
              after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-200">
      or
    </p>

    {#if firebaseError}
      <Alert>{firebaseError}</Alert>
    {/if}

    <form action="/" class="space-y-6" on:submit|preventDefault={handleSubmit}>
      <div>
        <label for="email" class="block mb-2 font-medium text-sm text-gray-900">
          Email address
        </label>

        <input
          id="email"
          type="email"
          name="email"
          on:change={handleChange}
          bind:value={$form.email}
          disabled={$isValidating || $isSubmitting}
          placeholder="name@example.com"
          class="p-2.5 w-full block
                  border border-gray-300 rounded-lg
                  bg-white text-gray-900 placeholder:text-gray-400
                  disabled:cursor-not-allowed disabled:opacity-75
                  {$errors.email &&
            'border-red-300 text-red-600 placeholder:text-red-300 focus:ring-red-600 focus:border-red-600'}" />

        {#if $errors.email}
        <small class="mt-2 text-sm text-red-600">{$errors.email}</small>
        {/if}
      </div>

      <div>
        <label
          for="password"
          class="block mb-2 font-medium text-sm text-gray-900">
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          on:change={handleChange}
          bind:value={$form.password}
          disabled={$isValidating || $isSubmitting}
          placeholder="••••••••"
          class="p-2.5 w-full block tracking-widest
                  border border-gray-300 rounded-lg
                  bg-white text-gray-900 placeholder:text-gray-400
                  disabled:cursor-not-allowed disabled:opacity-75
                  {$errors.password &&
            'border-red-300 text-red-600 placeholder:text-red-300 focus:ring-red-600 focus:border-red-600'}" />

        {#if $errors.password}
        <small class="mt-2 text-sm text-red-600">{$errors.password}</small>
        {/if}
      </div>

      <div>
        <label
          for="password_confirm"
          class="block mb-2 font-medium text-sm text-gray-900">
          Confirm password
        </label>

        <input
          id="password_confirm"
          type="password"
          name="password_confirm"
          on:change={handleChange}
          bind:value={$form.password_confirm}
          disabled={$isValidating || $isSubmitting}
          placeholder="••••••••"
          class="p-2.5 w-full block tracking-widest
                  border border-gray-300 rounded-lg
                  bg-white text-gray-900 placeholder:text-gray-400
                  disabled:cursor-not-allowed disabled:opacity-75
                  {$errors.password_confirm &&
            'border-red-300 text-red-600 placeholder:text-red-300 focus:ring-red-600 focus:border-red-600'}" />

        {#if $errors.password_confirm}
        <small class="mt-2 text-sm text-red-600">
          {$errors.password_confirm}
        </small>
        {/if}
      </div>

      <button
        type="submit"
        disabled={$isValidating || $isSubmitting}
        class="px-5 py-2.5 w-full rounded-lg
                text-white text-center font-medium
                bg-emerald-600 hover:bg-emerald-700
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:cursor-not-allowed disabled:opacity-75">
        {#if !($isValidating || $isSubmitting)}
          Create account
        {:else}
          <AniIconLoading class="mx-auto w-6 h-6" fill="#fff" />
        {/if}
      </button>

      <div class="text-center">
        <a
          href="/account/login"
          class="font-medium text-sm text-emerald-600 hover:text-emerald-900">
          Have an account already? Login instead
        </a>
      </div>
    </form>
  </div>
</div>
