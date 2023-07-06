<script lang="ts">
  import type { AuthProvider } from 'firebase/auth';
  import type { FormState } from '$lib/forms';

  import { Logo, LogoVendors } from '$lib/images';
  import { Alert, SocialLogin } from '$lib/components';
  import { IconGoogle, IconMicrosoft, AniIconLoading } from '$lib/icons';

  import { writable } from 'svelte/store';
  import { createForm } from 'svelte-forms-lib';
  import { schemaLogin, validateZod } from '$lib/forms';

  import {
    providerGoogle,
    providerMicrosoft,
    continueAuth,
    continueProvider,
    signInEmailPassword,
  } from '$lib/firebase/auth';

  const formState = writable<FormState>({
    isLoading: false,
    errorMessage: '',
  });

  const onSSO = (provider: AuthProvider) => async () => {
    await continueAuth(() => continueProvider(provider), formState);
  };

  const onSubmit = async (email: string, password: string) => {
    await continueAuth(() => signInEmailPassword(email, password), formState);
  };

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
    },
    validate: (values) => validateZod(schemaLogin, values),
    onSubmit: ({ email, password }) => onSubmit(email, password),
  });
</script>

<svelte:head>
  <title>Sign in | Dr. Receipt</title>
</svelte:head>

<section class="py-10 flex flex-col items-center">
  <div class="max-w-lg w-full">
    <a href="/">
      <Logo class="py-4 h-20 mx-auto" />
    </a>
  </div>

  <div class="max-w-lg w-full bg-white rounded-lg md:shadow md:border">
    <div class="p-4 space-y-6 md:p-6">
      <h1
        class="text-xl text-center text-gray-900
                font-bold md:text-left md:text-2xl">
        Sign in to your account
      </h1>

      <div class="flex flex-col gap-2 md:flex-row">
        <SocialLogin
          on:click={onSSO(providerGoogle)}
          disabled={$formState.isLoading || $isValidating || $isSubmitting}>
          <IconGoogle class="w-5 h-5 aspect-1" />
          Sign in with Google
        </SocialLogin>

        <SocialLogin
          on:click={onSSO(providerMicrosoft)}
          disabled={$formState.isLoading || $isValidating || $isSubmitting}>
          <IconMicrosoft class="w-5 h-5 aspect-1" />
          Sign in with Microsoft
        </SocialLogin>
      </div>

      <p
        class="flex flex-row text-center text-gray-500
                before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-200
                after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-200">
        or
      </p>

      {#if $formState.errorMessage}
        <Alert>{$formState.errorMessage}</Alert>
      {/if}

      <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
        <div>
          <label
            for="email"
            class="block mb-2 font-medium text-sm text-gray-900">
            Email address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            on:change={handleChange}
            bind:value={$form.email}
            disabled={$formState.isLoading || $isValidating || $isSubmitting}
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
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block mb-2 font-medium text-sm text-gray-900">
              Password
            </label>

            <a
              href="/account/reset"
              class="mb-2 font-thin text-sm text-emerald-700 hover:text-emerald-900">
              Forgot password?
            </a>
          </div>

          <input
            id="password"
            type="password"
            name="password"
            on:change={handleChange}
            bind:value={$form.password}
            disabled={$formState.isLoading || $isValidating || $isSubmitting}
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

        <button
          type="submit"
          disabled={$formState.isLoading || $isValidating || $isSubmitting}
          class="px-5 py-2.5 w-full rounded-lg
                  text-white text-center font-medium
                  bg-emerald-600 hover:bg-emerald-700
                  focus:outline-none focus:ring-4 focus:ring-green-300
                  disabled:cursor-not-allowed disabled:opacity-75">
          {#if !($formState.isLoading || $isValidating || $isSubmitting)}
            Continue
          {:else}
            <AniIconLoading class="mx-auto w-6 h-6" fill="#fff" />
          {/if}
        </button>

        <div class="text-center">
          <a
            href="/account/signup"
            class="font-medium text-sm text-emerald-600 hover:text-emerald-900">
            Create an account instead
          </a>
        </div>
      </form>
    </div>
  </div>

  <div class="mt-4 mx-auto flex flex-col space-y-1">
    <small class="text-center text-gray-500">Looking for vendor sign in?</small>
    <a href="/vendor/signin">
      <LogoVendors class="w-52" />
    </a>
  </div>
</section>
