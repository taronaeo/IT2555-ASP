<script lang="ts">
  import { Logo } from '$lib/images';
  import { IconCheckmark } from '$lib/icons';
</script>

<div class="mb-4">
  <a href="/">
    <Logo class="py-4 h-20" />
  </a>
</div>

<ul class="space-y-10">
  <li class="flex space-x-4">
    <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6" />
    <div>
      <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">
        Environmentally friendly
      </h3>

      <p class="text-gray-500">
        Our digital receipts reduces waste and helps the environment.
      </p>
    </div>
  </li>

  <li class="flex space-x-4">
    <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6" />
    <div>
      <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">
        Receipt consolidation
      </h3>

      <p class="text-gray-500">
        View all your purchases and digital receipts all-in-one place.
      </p>
    </div>
  </li>

  <li class="flex space-x-4">
    <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6" />
    <div>
      <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">
        Always-there™ receipts
      </h3>

      <p class="text-gray-500">
        View and download your digital receipts conveniently in PDF.</p>
    </div>
  </li>

  <li class="flex space-x-4">
    <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6" />
    <div>
      <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">
        Easy-disputes
      </h3>

      <p class="text-gray-500">
        Notice something not right in your receipt? File a dispute easily with
        an account.
      </p>
    </div>
  </li>

  <li class="flex space-x-4">
    <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6" />
    <div>
      <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">
        Vendor-ready
      </h3>

      <p class="text-gray-500">
        Need a vendor account for your operations? Register
        <a
          href="/account/register/vendor"
          class="font-medium text-emerald-600 underline underline-offset-2 hover:no-underline">
          here</a>
      </p>
    </div>
  </li>
</ul>
