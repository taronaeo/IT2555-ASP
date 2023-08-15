<script lang="ts">
  import { page } from '$app/stores';
  import { LogoVendors } from '$lib/images';
  import { AniIconLoading, IconGoogle, IconMicrosoft } from '$lib/icons';

  import { providerGoogle, providerMicrosoft } from '$lib/firebase/auth';
  import { Alert, SocialLogin, FormInput, FormCheckbox } from '$lib/components';

  import {
    state,
    onSSO,
    form,
    errors,
    isValidating,
    isSubmitting,
    handleChange,
    handleSubmit,
  } from './controller';

  const searchParams = decodeURIComponent($page.url.searchParams.toString());
</script>

<svelte:head>
  <title>Vendor Sign Up | Dr. Receipts</title>
</svelte:head>

<section class="grid grid-cols-2">
  <div
    class="hidden md:flex
            w-full h-screen p-20
            flex-col items-start justify-center
            bg-emerald-600">
    <LogoVendors class="h-10" gradient_start="white" gradient_stop="white" />

    <h1 class="my-4 text-6xl text-white font-bold tracking-tight">
      For you, for us, for the world.
    </h1>

    <p class="text-white">
      Millions of paper receipts printed daily contribute to deforestation and
      climate change — Join us as a vendor to make a difference today.
    </p>
  </div>

  <div
    class="col-span-full md:col-span-1
            px-10 flex flex-col gap-6 min-h-screen
            before:min-h-[40px] before:md:flex-grow
            after:min-h-[40px] after:md:flex-grow">
    <h1 class="text-xl font-bold">Create your vendor account</h1>

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

    <form class="space-y-4" on:submit|preventDefault={handleSubmit} novalidate>
      <FormInput
        id="email"
        type="email"
        label="Business email address"
        placeholder="contact@company.com"
        autocomplete="email"
        on:change={handleChange}
        bind:value={$form.email}
        labelClass="font-medium text-sm text-gray-900"
        disabled={$state.isLoading || $isValidating || $isSubmitting}
        errorMessage={$errors.email} />

      <FormInput
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autocomplete="new-password"
        on:change={handleChange}
        bind:value={$form.password}
        labelClass="font-medium text-sm text-gray-900"
        inputClass="tracking-widest"
        disabled={$state.isLoading || $isValidating || $isSubmitting}
        errorMessage={$errors.password} />

      <FormInput
        id="passwordConfirm"
        type="password"
        label="Confirm password"
        placeholder="••••••••"
        autocomplete="new-password"
        on:change={handleChange}
        bind:value={$form.passwordConfirm}
        labelClass="font-medium text-sm text-gray-900"
        inputClass="tracking-widest"
        disabled={$state.isLoading || $isValidating || $isSubmitting}
        errorMessage={$errors.passwordConfirm} />

      <FormCheckbox
        id="agreeToService"
        on:change={handleChange}
        bind:checked={$form.agreeToService}
        labelClass="text-sm text-gray-900"
        disabled={$state.isLoading || $isValidating || $isSubmitting}
        errorMessage={$errors.agreeToService}>
        By signing up, you are creating a Dr. Receipts Vendor account, and you
        agree to Dr. Receipt's
        <a
          href="#noop"
          class="font-medium text-emerald-600 hover:underline hover:underline-offset-2">
          Terms of Use
        </a>
        and
        <a
          href="#noop"
          class="font-medium text-emerald-600 hover:underline hover:underline-offset-2">
          Privacy Policy
        </a>
      </FormCheckbox>

      <button
        type="submit"
        disabled={$state.isLoading || $isValidating || $isSubmitting}
        class="px-5 py-2.5 w-full rounded-lg
                text-white text-center font-medium
                bg-emerald-600 hover:bg-emerald-700
                focus:outline-none focus:ring-4 focus:ring-green-300
                disabled:opacity-75 disabled:cursor-not-allowed">
        {#if !($state.isLoading || $isValidating || $isSubmitting)}
          Create vendor account
        {:else}
          <AniIconLoading class="w-6 h-6 mx-auto" fill="#fff" />
        {/if}
      </button>
    </form>

    <p class="text-sm">
      Already have an account?
      <a
        href="/vendor/signin?{searchParams}"
        class="font-medium text-emerald-600 hover:underline hover:underline-offset-2">
        Login here
      </a>
    </p>

    <p class="text-sm">
      Looking for user sign up?
      <a
        href="/account/signup?{searchParams}"
        class="font-medium text-emerald-600 hover:underline hover:underline-offset-2">
        Sign up here
      </a>
    </p>
  </div>
</section>
