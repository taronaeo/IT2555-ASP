<script>
  import IconCheckmark from '$lib/icons/checkmark.svg';
</script>

<svelte:head>
  <title>Login | Dr. Receipt</title>
</svelte:head>

<section class="grid grid-cols-11 gap-8">
  <div class="w-full h-full rounded-lg col-span-6 hidden text-gray-300 md:block">
    <ul class="mt-16 space-y-10">
      <li class="flex space-x-4">
        <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6">
        <div>
          <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">Receipt Consolidation</h3>
          <p class="text-gray-500">View all your purchases and digital receipts all-in-one place.</p>
        </div>
      </li>

      <li class="flex space-x-4">
        <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6">
        <div>
          <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">Always-there™️ receipts</h3>
          <p class="text-gray-500">View and download your digital receipts conveniently in PDF.</p>
        </div>
      </li>

      <li class="flex space-x-4">
        <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6">
        <div>
          <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">Easy-disputes</h3>
          <p class="text-gray-500">Notice something not right in your receipt? File a dispute easily with an account.</p>
        </div>
      </li>
    </ul>
  </div>

  <div class="col-span-12 md:col-span-5">
    <div class="md:shadow md:border bg-white rounded-lg">
      <div class="p-4 md:p-6 space-y-6 sm:p-8">
        <h1 class="text-xl text-center text-gray-900
                    font-bold md:text-left md:text-2xl">
          Sign in to your account
        </h1>

        <div class="flex flex-col gap-4 md:flex-row">
          <button class="px-5 py-2.5 w-full text-sm font-medium
                          border rounded-lg hover:bg-gray-100">
            Login with Google
          </button>

          <button class="px-5 py-2.5 w-full text-sm font-medium
                          border rounded-lg hover:bg-gray-100">
            Login with Microsoft
          </button>
        </div>

        <p class="flex flex-row text-center text-gray-500
                  before:mr-4 before:my-auto before:flex-1 before:border-b-2 before:border-dashed before:border-gray-200
                  after:ml-4 after:my-auto after:flex-1 after:border-b-2 after:border-dashed after:border-gray-200">
          or
        </p>

        <form action="/" class="space-y-6">
          <div>
            <label for="email" class="block mb-2 font-medium text-sm text-gray-900">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              class="p-2.5 w-full block
                      border border-gray-300 rounded-lg
                      bg-white text-gray-900 placeholder:text-gray-400"
              required />
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block mb-2 font-medium text-sm text-gray-900">Password</label>
              <a
                target="_self"
                href="/account/reset"
                class="mb-2 font-thin text-sm text-emerald-700 hover:text-emerald-900">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              class="p-2.5 w-full block
                      border border-gray-300 rounded-lg
                      bg-white text-gray-900 placeholder:text-gray-400
                      tracking-widest" />
          </div>

          <button
            type="submit"
            class="px-5 py-2.5 w-full rounded-lg
                    text-white text-center font-medium
                    bg-emerald-600 hover:bg-emerald-700
                    focus:outline-none focus:ring-4 focus:ring-green-300">
            Continue
          </button>

          <div class="text-center">
            <a
              target="_self"
              href="/account/register"
              class="font-medium text-sm text-emerald-600 hover:text-emerald-900">Create an account instead</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
