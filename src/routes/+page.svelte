<script lang="ts">
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
  import { User } from '$lib';
	import { auth } from '$lib/firebase'

  let login_email = '';
  let login_password = '';
	let login_error = '';
  let signup_email = '';
  let signup_password = '';

  async function login() {
		try {
			await signInWithEmailAndPassword(auth, login_email, login_password);
		} catch (error: any) {
			if (error.code === 'auth/user-not-found') {
				login_error = 'User not found!';
				return;
			} else if (error.code === 'auth/wrong-password') {
				login_error = 'Invalid password!';
				return;
			} else {
				console.log(error);
				return;
			}
		}
	}

	async function signup() {
		try {
			await createUserWithEmailAndPassword(auth, signup_email, signup_password);
		} catch (error) {
			console.error(error)
		}
	}

	async function logout() {
		try {
			await signOut(auth)
		} catch (error) {
			console.error(error)
		}
	}
</script>

<svelte:head>
  <title>IT2555-ASP | Kickstarter</title>
</svelte:head>

<section>
  <h1 class="my-8 text-4xl font-bold">
    Welcome to IT2555 Application Security, Kickstarter page!
  </h1>

  <ol class="mb-4 list-decimal list-inside">
    <li class="mb-2 text-3xl">Authentication using Firebase Auth using Identity Provider</li>

    <User let:user>
      <p class="mb-4 text-green-500">Congratulations, {user.email}! You have successfully logged in.</p>

			<button
				type="button"
				on:click={logout}
				class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
				Logout
			</button>

      <div slot="signedOut">
        <p class="mb-4 text-red-500">You are currently logged out.</p>

        <div class="flex flex-col gap-6 md:flex-row">
          <div class="w-full space-y-4">
            <h3 class="text-xl">Login</h3>

            <div class="w-full">
              <label
                for="login_email"
                class="mb-2 block text-sm font-medium text-white after:ml-1 after:content-['*'] after:text-red-500">
                Email Address
              </label>

              <input
                id="login_email"
                type="email"
                bind:value={login_email}
                placeholder="john.doe@email.com"
                class="p-2.5 block w-full text-sm text-white rounded-lg bg-gray-600 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div class="w-full">
              <label
                for="login_password"
                class="mb-2 block text-sm font-medium text-white after:ml-1 after:content-['*'] after:text-red-500">
                Password
              </label>

              <input
                id="login_password"
                type="password"
                bind:value={login_password}
                placeholder="• • • • • • • •"
                class="tracking-widest p-2.5 block w-full text-sm text-white rounded-lg bg-gray-600 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <button
              type="button"
              on:click={login}
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Login
            </button>

						<p class="text-red-500">{ login_error }</p>
          </div>

          <div class="w-full space-y-4">
            <h3 class="mb-4 text-xl">Sign-Up</h3>

            <div class="w-full">
              <label
                for="signup_email"
                class="mb-2 block text-sm font-medium text-white after:ml-1 after:content-['*'] after:text-red-500">
                Email Address
              </label>

              <input
                id="signup_email"
                type="email"
                bind:value={signup_email}
                placeholder="john.doe@email.com"
                class="p-2.5 block w-full text-sm text-white rounded-lg bg-gray-600 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div class="w-full">
              <label
                for="signup_password"
                class="mb-2 block text-sm font-medium text-white after:ml-1 after:content-['*'] after:text-red-500">
                Password
              </label>

              <input
                id="signup_password"
                type="password"
                bind:value={signup_password}
                placeholder="• • • • • • • •"
                class="tracking-widest p-2.5 block w-full text-sm text-white rounded-lg bg-gray-600 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <button
              type="button"
							on:click={signup}
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Sign-Up
            </button>
          </div>
        </div>
      </div>
    </User>

    <li class="mb-2 text-3xl">Read your User document</li>
  </ol>
</section>

<style lang="postcss">
</style>
