<script>
  import { Logo } from '$lib/images';

  import { authStore } from '$lib/stores'
  import { IconMenu, IconClose } from '$lib/icons'

  let isDropdownActive = false;
</script>

<nav
  class="z-50 fixed top-0 w-full
          border-b-4 border-emerald-700
          bg-gradient-to-r from-emerald-600 to-[#008080]">
  <div class="h-16 mx-auto container
              flex flex-row flex-wrap justify-start">
    <!-- Dr. Receipt Logo -->
    <a href="/" class="px-6 py-2 h-full">
      <Logo class='h-full' gradient_start='#fff' gradient_stop='#fff' />
    </a>

    <div class="ml-auto flex flex-row md:order-2">
      <!-- Navbar CTA Button -->
      <a
        href={!$authStore ? '/account/login' : '/account/profile'}
        class="p-4 h-full inline-flex items-center
                text-lg text-white text-center font-medium
                hover:text-emerald-200 focus:outline-none">
          {!$authStore ? 'Login' : 'Profile'}
        </a>

      <!-- Navbar Mobile Menu Button -->
      <button
        on:click={() => isDropdownActive = !isDropdownActive}
        class="p-4 w-full h-full inline-flex items-center justify-center
                md:hidden focus:outline-none">
        <img src={!isDropdownActive ? IconMenu : IconClose} alt="Open Menu" class="m-1 w-6 h-6">
      </button>
    </div>

    <!-- Middle Menu Links -->
    <div class="{isDropdownActive ? 'block' : 'hidden md:flex'}
                py-4 z-20 w-full min-h-full md:h-full md:p-0
                flex flex-col md:flex-row md:items-center
                bg-gradient-to-r from-emerald-600 to-[#008080]
                md:w-auto md:order-1 md:from-transparent md:to-transparent">
      <a href="/" class="px-6 py-2 h-full text-lg text-white font-medium
                          md:py-5 md:text-white md:hover:bg-emerald-700">
        Who we are
      </a>

      <a href="/" class="px-6 py-2 h-full text-lg text-white font-medium
                          md:py-5 md:text-white md:hover:bg-emerald-700">
        Tools and services
      </a>
    </div>
  </div>
</nav>
