<script>
  import { Logo } from '$lib/images';

  import { authStore } from '$lib/stores';
  import { IconMenu, IconClose } from '$lib/icons';

  let isDropdownActive = false;
</script>

<nav
  class="z-50 sticky top-0 w-full
          border-b-4 border-emerald-700
          bg-gradient-to-r from-emerald-600 to-[#008080]">
  <div class="h-14 flex flex-row flex-wrap justify-start">
    <!-- Dr. Receipt Logo -->
    <a href="/" class="pl-4 py-2 h-full md:px-4">
      <Logo class="h-full" gradientStart="#fff" gradientStop="#fff" />
    </a>

    <div class="ml-auto flex flex-row md:order-2">
      <!-- Navbar CTA Button -->
      <a
        href={!$authStore ? '/account/signin' : '/dashboard'}
        class="p-4 h-14 inline-flex items-center
                text-sm text-white text-center font-medium
                hover:text-emerald-200 focus:outline-none">
        {!$authStore ? 'Login' : 'Profile'}
      </a>

      <!-- Navbar Mobile Menu Button -->
      <button
        type="button"
        on:click={() => (isDropdownActive = !isDropdownActive)}
        class="p-4 h-14 aspect-1 inline-flex items-center justify-center
                md:hidden focus:outline-none">
        <img
          src={!isDropdownActive ? IconMenu : IconClose}
          alt="Open Menu"
          class="m-1 w-6 h-6" />
      </button>
    </div>

    <!-- Middle Menu Links -->
    <div
      class="{isDropdownActive ? 'block' : 'hidden md:flex'}
                py-4 z-20 w-full min-h-full md:h-full md:p-0
                flex flex-col md:flex-row md:items-center
                bg-gradient-to-r from-emerald-600 to-[#008080]
                md:w-auto md:order-1 md:from-transparent md:to-transparent">
      <a
        href="/"
        class="px-6 py-2 h-full text-sm text-white font-medium
                md:py-5 md:text-white md:hover:bg-emerald-700">
        Home
      </a>

      <a
        href="/dashboard/receipts"
        class="px-6 py-2 h-full text-sm text-white font-medium
                md:py-5 md:text-white md:hover:bg-emerald-700">
        Consolidations
      </a>

      <a
        href="/disputeHandling"
        class="px-6 py-2 h-full text-sm text-white font-medium
                md:py-5 md:text-white md:hover:bg-emerald-700">
        Dispute Handling
      </a>

      <a
        href="/contact-us"
        class="px-6 py-2 h-full text-sm text-white font-medium
                md:py-5 md:text-white md:hover:bg-emerald-700">
        Contact Us
      </a>

      <a
        href="/receiptVerification"
        class="px-6 py-2 h-full text-sm text-white font-medium
                md:py-5 md:text-white md:hover:bg-emerald-700">
        Receipt Verification
      </a>
    </div>
  </div>
</nav>
