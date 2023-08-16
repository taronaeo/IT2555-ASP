<script lang="ts">
  import type { AuthProvider } from 'firebase/auth';
  import type { FormState } from '$lib/forms';

  import { Logo, LogoVendors } from '$lib/images';
  import { Alert, SocialLogin } from '$lib/components';
  import {
    IconGoogle,
    IconMicrosoft,
    IconCheckmark,
    AniIconLoading,
  } from '$lib/icons';

  import { page } from '$app/stores';
  import { writable } from 'svelte/store';
  import { createForm } from 'svelte-forms-lib';
  import { schemaRegister, validateZod } from '$lib/forms';

  import {
    providerGoogle,
    providerMicrosoft,
    continueAuth,
    continueProvider,
    signUpEmailPassword,
  } from '$lib/firebase/auth';

  const searchParams = decodeURIComponent($page.url.searchParams.toString());

  const benefits = [
    [
      'Environmentally friendly',
      'Our digital receipts reduces waste and helps the environment.',
    ],
    [
      'Receipt consolidation',
      'View all your purchases and digital receipts all-in-one place.',
    ],
    [
      'Always-there™ receipts',
      'View and download your digital receipts conveniently in PDF.',
    ],
    [
      'Easy disputes',
      'Notice something not right in your receipt? \
        File a dispute easily with an account.',
    ],
  ];

  const state = writable<FormState>({
    isLoading: false,
    errorMessage: '',
  });

  const onSSO = (provider: AuthProvider) => async () => {
    await continueAuth(() => continueProvider(provider), state);
  };

  const onSubmit = async (email: string, password: string) => {
    await continueAuth(() => signUpEmailPassword(email, password), state);
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
      confirmPassword: '',
    },
    validate: (data) => validateZod(schemaRegister, data),
    onSubmit: async ({ email, password }) => onSubmit(email, password),
  });
</script>

<svelte:head>
  <title>Create your account | Dr. Receipts</title>
</svelte:head>

<!-- !BUGFIX: Logo not displaying properly -->
<!-- !        DO NOT DELETE LINE BELOW     -->
<Logo class="w-0 h-0 invisible" />

<section class="py-10 md:p-10 flex flex-col gap-4">
  <div class="grid grid-cols-12 gap-8">
    <!-- Left half -->
    <div
      class="hidden md:block rounded-lg
              col-span-12 md:col-span-6">
      <div class="mb-4">
        <a href="/">
          <Logo class="py-4 h-20" />
        </a>
      </div>

      <ul class="space-y-10">
        {#each benefits as [title, description]}
          <li class="flex flex-row space-x-6">
            <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6" />

            <div>
              <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">
                {title}
              </h3>

              <p class="text-gray-500">{description}</p>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Right half -->
    <div class="col-span-12 md:col-span-6">
      <a href="/" class="block md:hidden">
        <Logo class="py-4 h-20 mx-auto" />
      </a>

      <div class="bg-white rounded-lg md:border md:shadow">
        <div class="p-4 space-y-6 md:p-6">
          <h1
            class="text-xl text-center text-gray-900
                    font-bold md:text-left md:text-2xl">
            Create your account
          </h1>

          <!-- Socials -->
          <div class="flex flex-col gap-2 md:flex-row">
            <SocialLogin
              on:click={onSSO(providerGoogle)}
              disabled={$state.isLoading || $isValidating || $isSubmitting}>
              <IconGoogle class="w-5 h-5 aspect-1" />
              Sign up with Google
            </SocialLogin>

            <SocialLogin
              on:click={onSSO(providerMicrosoft)}
              disabled={$state.isLoading || $isValidating || $isSubmitting}>
              <IconMicrosoft class="w-5 h-5 aspect-1" />
              Sign up with Microsoft
            </SocialLogin>
          </div>

          <p
            class="flex flex-row text-center text-gray-500
                    before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-200
                    after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-200">
            or
          </p>

          {#if $state.errorMessage}
            <Alert>{$state.errorMessage}</Alert>
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
                autocomplete="email"
                placeholder="name@example.com"
                on:change={handleChange}
                bind:value={$form.email}
                disabled={$state.isLoading || $isValidating || $isSubmitting}
                class="p-2.5 w-full block
                        border border-gray-300 rounded-lg
                        bg-white text-gray-900 placeholder:text-gray-400
                        disabled:cursor-not-allowed disabled:opacity-75
                        {$errors.email &&
                  'border-red-300 text-red-600 placeholder:text-red-300 focus:ring-red-600 focus:border-red-600'}" />

              {#if $errors.email}
                <small class="mt-2 text-sm text-red-600">
                  {$errors.email}
                </small>
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
                autocomplete="new-password"
                placeholder="••••••••"
                on:change={handleChange}
                bind:value={$form.password}
                disabled={$state.isLoading || $isValidating || $isSubmitting}
                class="p-2.5 w-full block tracking-widest
                        border border-gray-300 rounded-lg
                        bg-white text-gray-900 placeholder:text-gray-400
                        disabled:cursor-not-allowed disabled:opacity-75
                        {$errors.password &&
                  'border-red-300 text-red-600 placeholder:text-red-300 focus:ring-red-600 focus:border-red-600'}" />

              {#if $errors.password}
                <small class="mt-2 text-sm text-red-600">
                  {$errors.password}
                </small>
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
                autocomplete="new-password"
                placeholder="••••••••"
                on:change={handleChange}
                bind:value={$form.confirmPassword}
                disabled={$state.isLoading || $isValidating || $isSubmitting}
                class="p-2.5 w-full block tracking-widest
                        border border-gray-300 rounded-lg
                        bg-white text-gray-900 placeholder:text-gray-400
                        disabled:cursor-not-allowed disabled:opacity-75
                        {$errors.confirmPassword &&
                  'border-red-300 text-red-600 placeholder:text-red-300 focus:ring-red-600 focus:border-red-600'}" />

              {#if $errors.confirmPassword}
                <small class="mt-2 text-sm text-red-600">
                  {$errors.confirmPassword}
                </small>
              {/if}
            </div>

            <button
              type="submit"
              disabled={$state.isLoading || $isValidating || $isSubmitting}
              class="px-5 py-2.5 w-full rounded-lg
                      text-white text-center font-medium
                      bg-emerald-600 hover:bg-emerald-700
                      focus:outline-none focus:ring-4 focus:ring-green-300
                      disabled:cursor-not-allowed disabled:opacity-75">
              {#if !($state.isLoading || $isValidating || $isSubmitting)}
                Create account
              {:else}
                <AniIconLoading class="mx-auto w-6 h-6" fill="#fff" />
              {/if}
            </button>

            <div class="text-center">
              <a
                href="/account/signin?{searchParams}"
                class="font-medium text-sm text-emerald-600 hover:text-emerald-900">
                Have an account already? Sign in instead
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="mx-auto flex flex-col space-y-1">
    <small class="text-center text-gray-500">Looking for other sign ups?</small>
    <a href="/vendor/signup?{searchParams}">
      <LogoVendors class="w-52" />
    </a>
  </div>
</section>
