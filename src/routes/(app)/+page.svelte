<script>
  import './page.css';
  import { assets } from '$app/paths';

  const featuredStores = [
    'esso',
    'fairprice',
    'cold-storage',
    'cheers',
    '7-eleven',
    'subway',
    'nbcb',
    'koufu',
    'storhub',
    'mandarin',
    'challenger',
    'harvey-norman',
  ];
</script>

<svelte:head>
  <title>World of Digital Receipts | Dr. Receipts</title>
</svelte:head>

<section>
  <div
    class="px-5 py-16
            mx-auto container
            grid grid-rows-2 lg:grid-cols-2">
    <div class="row-span-2 space-y-6">
      <h1
        class="font-bold text-5xl text-center text-transparent
                bg-clip-text bg-gradient-to-r from-[#7da920] to-[#c9e71b]
                lg:text-7xl lg:text-left">
        Digital Receipts for the everyday consumer.
      </h1>

      <img
        src="{assets}/mockup-receipt-page.png"
        alt="M2 MacBook Pro Mockup"
        class="py-10 lg:hidden" />

      <p class="text-lg font-medium">
        Simplify your purchases, one receipt at a time. Join our platform today
        to keep track of your budget, expenses, and see a difference!
      </p>

      <div class="flex flex-col md:flex-row gap-5">
        <a
          href="/"
          class="px-5 py-3 block w-full rounded
                  text-sm md:text-base text-white text-center
                  bg-emerald-600 md:w-fit">
          Learn more
        </a>

        <a
          href="/account/signup"
          class="px-5 py-3
                  w-full block rounded
                  text-sm md:text-base text-center
                  border-2 border-emerald-600 md:w-fit">
          Get started free
        </a>
      </div>
    </div>

    <div class="row-span-2">
      <img
        src="{assets}/mockup-receipt-page.png"
        alt="M2 MacBook Pro Mockup"
        class="hidden lg:block" />
    </div>
  </div>

  <div class="bg-black">
    <div class="py-16 mx-auto container">
      <div class="px-5">
        <h3 class="text-3xl text-white text-center font-bold">
          Receive digital receipts from hundreds of stores islandwide
        </h3>
      </div>

      <div class="p-12 grid-companies text-white">
        {#each featuredStores as store}
          <img
            src="{assets}/logo-inverted-{store}.png"
            alt={store}
            class="w-16 align-middle" />
        {/each}
      </div>
    </div>
  </div>

  <div class="px-5 py-12 mx-auto container">
    <h2 class="mb-2 text-3xl lg:text-5xl font-bold">New stores this week</h2>
    <p class="mb-6 text-lg">Go shopping at these stores!</p>

    <div
      class="mb-6 w-full
              grid grid-rows-1 lg:grid-cols-3 gap-6">
      <div class="p-4 flex flex-col rounded-2xl bg-gray-100">
        <img
          src="{assets}/featured-fairprice-vivocity.jpeg"
          alt="Fairprice Vivocity"
          class="mb-6 h-32 object-cover rounded-lg" />

        <img
          src="{assets}/logo-fairprice-xtra.png"
          alt="Fairprice Xtra"
          class="mb-2 w-fit h-10" />

        <p
          class="text-sm text-transparent
                  bg-clip-text bg-gradient-to-r from-[#015697] to-[#ee2d24]">
          Supermarket at Vivocity
        </p>
      </div>

      <div class="p-4 flex flex-col rounded-2xl bg-gray-100">
        <img
          src="{assets}/featured-nbcb-orchard.jpeg"
          alt="Nothing But Cheese Burgers Orchard Central"
          class="mb-6 h-32 object-cover rounded-lg" />

        <img
          src="{assets}/logo-nbcb.png"
          alt="Nothing But Cheese Burgers"
          class="mb-2 w-fit h-10" />

        <p
          class="text-sm text-transparent
                  bg-clip-text bg-gradient-to-r from-[#3f3a3b] to-[#eedf4e]">
          Singaporean born burger chain at Orchard Central
        </p>
      </div>

      <div class="p-4 flex flex-col rounded-2xl bg-gray-100">
        <img
          src="{assets}/featured-7-eleven-raffles.jpg"
          alt="7-Eleven Raffles Place"
          class="mb-6 h-32 object-cover rounded-lg" />

        <img
          src="{assets}/logo-7-eleven.png"
          alt="7-Eleven"
          class="mb-2 w-fit h-10" />

        <p
          class="text-sm text-transparent
                  bg-clip-text bg-gradient-to-r from-[#eb0f29] to-[#147351]">
          Convenience store at Raffles Place
        </p>
      </div>
    </div>

    <div
      class="p-6 md:p-6 lg:p-12 rounded-2xl
              flex flex-col lg:flex-row items-start lg:items-center justify-between
              bg-gradient-to-br from-[#7da920] to-[#c9e71b]">
      <div class="mb-4 lg:m-0">
        <h4 class="mb-2 text-2xl text-white font-bold">
          Get receipts from these stores and more, today
        </h4>

        <p class="text-lg text-white font-medium">
          Join Dr. Receipts for free and get receipts at a touch of a scan.
        </p>
      </div>

      <div>
        <a
          href="/account/signup"
          class="px-8 py-2.5 block w-full rounded-lg
                  text-black text-center font-bold
                  bg-white md:w-fit">
          Get started
        </a>
      </div>
    </div>
  </div>

  <div class="px-5 py-12 mx-auto container">
    <h2 class="mb-6 text-3xl font-bold">How it works</h2>

    <div
      class="mb-6 w-full
              grid grid-rows-1 lg:grid-cols-3 gap-6">
      <div class="p-4 flex flex-col rounded-2xl bg-gray-100">
        <img
          src="{assets}/mockup-iphone.png"
          alt="iPhone Mockup"
          class="mb-6 w-36 mx-auto" />

        <span class="mb-2 text-sm text-gray-400 font-bold">Step 1</span>
        <h5 class="mb-2 text-2xl font-bold">
          Make a purchase at any participating store
        </h5>
        <p class="text-sm">Go through the checkout process as usual</p>
      </div>

      <div class="p-4 flex flex-col rounded-2xl bg-gray-100">
        <img
          src="{assets}/mockup-iphone.png"
          alt="iPhone Mockup"
          class="mb-6 w-36 mx-auto" />

        <span class="mb-2 text-sm text-gray-400 font-bold">Step 2</span>
        <h5 class="mb-2 text-2xl font-bold">
          Scan the QR code presented on the screen
        </h5>
        <p class="text-sm">Use your normal camera app to scan the QR code</p>
      </div>

      <div class="p-4 flex flex-col rounded-2xl bg-gray-100">
        <img
          src="{assets}/mockup-iphone.png"
          alt="iPhone Mockup"
          class="mb-6 w-36 mx-auto" />

        <span class="mb-2 text-sm text-gray-400 font-bold">Step 3</span>
        <h5 class="mb-2 text-2xl font-bold">See your receipt digitally</h5>
        <p class="text-sm">
          Add the receipt to your account, or check for discrepancies.
        </p>
      </div>
    </div>
  </div>
</section>
