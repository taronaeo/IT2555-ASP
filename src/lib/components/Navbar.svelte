<script>
  import Menu from '$lib/icons/menu.svg';
  import Close from '$lib/icons/close.svg';
  import Logo from '$lib/images/logo.png';

  let isDropdownActive = false;
</script>

<nav class="border-b-4 border-emerald-300 bg-emerald-600">
  <div class="h-16 mx-auto container
              flex flex-wrap items-center justify-between md:justify-start">
    <!-- Dr. Receipt Logo -->
    <a href="/" class="pl-2 h-full">
      <img src={Logo} alt="Dr. Receipts Logo" class="mr-4 h-full">
    </a>

    <div class="h-full ml-auto flex align-middle justify-center md:order-2">
      <!-- Navbar CTA Button -->
      <a href="/register" class="px-4
                              inline-flex justify-center items-center
                              text-sm text-white text-center font-medium
                              hover:bg-emerald-700 focus:outline-none">
                              Register
      </a>

      <!-- Navbar Mobile Menu Button -->
      <button on:click={() => isDropdownActive = !isDropdownActive}
              class="p-4 aspect-1 inline-flex items-center justify-center
                      md:hidden focus:outline-none">
        <img src={!isDropdownActive ? Menu : Close} alt="Open Menu" class="w-6 h-6">
      </button>
    </div>

    <!-- Middle Menu Links -->
    <div class="py-4 z-20 w-full min-h-full md:p-0
                {isDropdownActive ? 'block' : 'hidden md:flex'} bg-emerald-300 md:bg-inherit
                flex flex-col md:flex-row md:items-center
                md:w-auto md:order-1">
      <a href="/who" class="px-6 py-2 text-emerald-900 hover:bg-emerald-200
                            md:py-5 md:text-white md:hover:bg-emerald-700">
        Who are we
      </a>

      <a href="/who" class="px-6 py-2 text-emerald-900 hover:bg-emerald-200
                            md:py-5 md:text-white md:hover:bg-emerald-700">
        Tools and services
      </a>

      <a href="/who" class="px-6 py-2 text-emerald-900 hover:bg-emerald-200
                            md:py-5 md:text-white md:hover:bg-emerald-700">
        Login
      </a>
    </div>
  </div>
</nav>
