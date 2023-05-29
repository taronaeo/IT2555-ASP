<script>
  import Menu from '$lib/icons/menu.svg';
  import Close from '$lib/icons/close.svg';
  import Logo from '$lib/images/logo.png';

  let isDropdownActive = false;
</script>

<nav class="z-50 fixed top-0 w-full border-b-4 border-emerald-700 bg-gradient-to-r from-emerald-600 to-[#008080]">
  <div class="h-16 mx-auto container
              flex flex-wrap items-center justify-between md:justify-start">
    <!-- Dr. Receipt Logo -->
    <a href="/" class="pl-2 h-full">
      <img src={Logo} alt="Dr. Receipts Logo" class="mr-4 h-full">
    </a>

    <div class="h-full ml-auto flex flex-row md:order-2">
      <!-- Navbar CTA Button -->
      <a href="/register" class="p-4 inline-flex items-center
                                  text-lg text-white text-center font-medium duration-100 transition-colors
                                  hover:text-emerald-200 focus:outline-none">
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
    <div class="{isDropdownActive ? 'block' : 'hidden md:flex'}
                py-4 z-20 w-full min-h-full md:p-0
                flex flex-col md:flex-row md:items-center
                bg-gradient-to-r from-emerald-600 to-[#008080] md:bg-inherit md:from-transparent md:to-transparent
                md:w-auto md:order-1">
      <a href="/who" class="px-6 py-2 text-lg text-white font-medium
                            md:py-5 md:text-white md:hover:bg-emerald-700">
        We are who
      </a>

      <a href="/who" class="px-6 py-2 text-lg text-white font-medium
                            md:py-5 md:text-white md:hover:bg-emerald-700">
        Tools and services
      </a>
    </div>
  </div>
</nav>
