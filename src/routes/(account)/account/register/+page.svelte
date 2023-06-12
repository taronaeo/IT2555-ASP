<script lang="ts">
  import { Logo } from '$lib/images';
  import {
    IconGoogle,
    IconMicrosoft,
    IconCheckmark,
    AniIconLoading
  } from '$lib/icons';

  import { auth } from '$lib/firebase'
  import {
    setPersistence,
    indexedDBLocalPersistence,
    createUserWithEmailAndPassword
  } from 'firebase/auth'

  let full_name: string = '';
  let email: string = '';
  let password: string = '';
  let isLoading: boolean = false;

  const benefits = [
    { title: 'Environmentally friendly', description: 'Our digital receipts reduces waste and helps the environment.' },
    { title: 'Receipt consolidation', description: 'View all your purchases and digital receipts all-in-one place.' },
    { title: 'Always-there™ receipts', description: 'View and download your digital receipts conveniently in PDF.' },
    { title: 'Easy-disputes', description: 'Notice something not right in your receipt? File a dispute easily with an account.' }
  ]

  async function signUpEmailPassword() {
    isLoading = true;

    try {
      await setPersistence(auth, indexedDBLocalPersistence);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }

    isLoading = false;
  }
</script>

<svelte:head>
  <title>Create your account | Dr. Receipt</title>
</svelte:head>

<section class="p-10 w-full grid grid-cols-12 gap-8">
  <div class="hidden md:block rounded-lg text-gray-300
              col-span-6 md:col-span-6 xl:col-span-7">
    <div class="mb-4">
      <a href="/">
        <Logo class='py-4 h-20' />
      </a>
    </div>

    <ul class="space-y-10">
      {#each benefits as { title, description }}
        <li class="flex space-x-4">
          <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6">
          <div>
            <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">{title}</h3>
            <p class="text-gray-500">{description}</p>
          </div>
        </li>
      {/each}
    </ul>
  </div>

  <div class="col-span-12 md:col-span-6 xl:col-span-5">
    <a href="/">
      <Logo class='py-4 h-20 mx-auto md:hidden' />
    </a>

    <div class="bg-white rounded-lg md:shadow md:border">
      <div class="p-4 space-y-6 md:p-6">
        <h1 class="text-xl text-center text-gray-900
                    font-bold md:text-left md:text-2xl">
          Create your account
        </h1>

        <div class="flex flex-col gap-2 md:flex-row">
          <button
            disabled={isLoading}
            class="px-4 py-2.5 w-full
                    text-sm font-medium border rounded-lg
                    inline-flex items-center justify-center gap-2
                    hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-emerald-300">
            <IconGoogle class='w-5 h-5 aspect-1' />
            Sign up with Google
          </button>

          <button
            disabled={isLoading}
            class="px-4 py-2.5 w-full
                    text-sm font-medium border rounded-lg
                    inline-flex items-center justify-center gap-2
                    hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-emerald-300">
            <IconMicrosoft class='w-5 h-5 aspect-1' />
            Sign up with Microsoft
          </button>
        </div>

        <p class="flex flex-row text-center text-gray-500
                  before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-200
                  after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-200">
          or
        </p>

        <form action="/" class="space-y-6" on:submit|preventDefault={signUpEmailPassword}>
          <div>
            <label for="email" class="block mb-2 font-medium text-sm text-gray-900">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              disabled={isLoading}
              bind:value={email}
              placeholder="name@example.com"
              class="p-2.5 w-full block
                      border border-gray-300 rounded-lg
                      bg-white text-gray-900 placeholder:text-gray-400
                      disabled:cursor-not-allowed disabled:opacity-75"
              required />
          </div>

          <div>
            <label for="full_name" class="block mb-2 font-medium text-sm text-gray-900">Full name</label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              disabled={isLoading}
              bind:value={full_name}
              placeholder="John Doe"
              class="p-2.5 w-full block
                      border border-gray-300 rounded-lg
                      bg-white text-gray-900 placeholder:text-gray-400
                      disabled:cursor-not-allowed disabled:opacity-75"
              required />
          </div>

          <div>
            <label for="password" class="block mb-2 font-medium text-sm text-gray-900">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              disabled={isLoading}
              bind:value={password}
              placeholder="••••••••"
              class="p-2.5 w-full block tracking-widest
                      border border-gray-300 rounded-lg
                      bg-white text-gray-900 placeholder:text-gray-400
                      disabled:cursor-not-allowed disabled:opacity-75"
              required />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            class="px-5 py-2.5 w-full rounded-lg
                    text-white text-center font-medium
                    bg-emerald-600 hover:bg-emerald-700
                    focus:outline-none focus:ring-4 focus:ring-green-300
                    disabled:cursor-not-allowed disabled:opacity-75">
            {#if !isLoading}
              Create account
            {:else}
              <AniIconLoading class='mx-auto w-6 h-6' fill='#fff' />
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
  </div>
</section>
