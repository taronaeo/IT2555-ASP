<script lang="ts">
  import { Logo } from '$lib/images';
  import { IconGoogle, IconMicrosoft, AniIconLoading } from '$lib/icons';

  import { Alert } from '$lib/components';
  import { createForm } from 'svelte-forms-lib';
  import { schemaLogin, validateZod } from '$lib/forms';

  import { auth } from '$lib/firebase';
  import {
    indexedDBLocalPersistence,
    setPersistence,
    signInWithPopup,
    signInWithEmailAndPassword,
    OAuthProvider,
    GoogleAuthProvider,
    AuthErrorCodes,
  } from 'firebase/auth';

  let firebaseError = '';

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
    onSubmit: ({ email, password }) => signInEmailPassword(email, password),
  });

  async function signInEmailPassword(email: string, password: string) {
    try {
      await setPersistence(auth, indexedDBLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      switch (error.code) {
        case AuthErrorCodes.USER_DELETED:
        case AuthErrorCodes.INVALID_PASSWORD:
          firebaseError = 'Invalid email or password, please try again';
          break;
        default:
          firebaseError = 'Something went wrong, please try again in a while';
          break;
      }

      console.error(error);
    }
  }

  async function signInGoogleSSO() {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

    try {
      await setPersistence(auth, indexedDBLocalPersistence);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  }

  async function signInMicrosoftSSO() {
    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('email');
    provider.addScope('profile');

    try {
      await setPersistence(auth, indexedDBLocalPersistence);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<svelte:head>
  <title>Login | Dr. Receipt</title>
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
        <button
          on:click={signInGoogleSSO}
          class="btn-social"
          disabled={$isValidating || $isSubmitting}>
          <IconGoogle class="w-5 h-5 aspect-1" />
          Sign in with Google
        </button>

        <button
          on:click={signInMicrosoftSSO}
          class="btn-social"
          disabled={$isValidating || $isSubmitting}>
          <IconMicrosoft class="w-5 h-5 aspect-1" />
          Sign in with Microsoft
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

        <button
          type="submit"
          disabled={$isValidating || $isSubmitting}
          class="px-5 py-2.5 w-full rounded-lg
                  text-white text-center font-medium
                  bg-emerald-600 hover:bg-emerald-700
                  focus:outline-none focus:ring-4 focus:ring-green-300
                  disabled:cursor-not-allowed disabled:opacity-75">
          {#if !($isValidating || $isSubmitting)}
            Continue
          {:else}
            <AniIconLoading class="mx-auto w-6 h-6" fill="#fff" />
          {/if}
        </button>

        <div class="text-center">
          <a
            href="/account/register"
            class="font-medium text-sm text-emerald-600 hover:text-emerald-900">
            Create an account instead
          </a>
        </div>
      </form>
    </div>
  </div>
</section>
