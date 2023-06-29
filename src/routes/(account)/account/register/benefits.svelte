<script lang="ts">
  import { Logo } from '$lib/images';
  import { IconCheckmark } from '$lib/icons';

  const benefits = [
    ['Environmentally friendly', 'Our digital receipts reduces waste and helps the environment.'],
    ['Receipt consolidation', 'View all your purchases and digital receipts all-in-one place.'],
    ['Always-there™ receipts', 'View and download your digital receipts conveniently in PDF.'],
    ['Easy disputes', 'Notice something not right in your receipt? File a dispute easily with an account.']
  ];
</script>

<div class="mb-4">
  <a href="/">
    <Logo class="py-4 h-20" />
  </a>
</div>

<ul class="space-y-10">
  {#each benefits as [title, description]}
  <li class="flex space-x-4">
    <img src={IconCheckmark} alt="Checkmark Icon" class="w-6 h-6" />
    <div>
      <h3 class="mb-2 font-bold text-xl text-emerald-800 leading-6">
        {title}
      </h3>

      <p class="text-gray-500">
        {description}
      </p>
    </div>
  </li>
  {/each}
</ul>
