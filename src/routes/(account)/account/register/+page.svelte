<script lang="ts">
  import Benefits from './benefits.svelte';
  import RegisterForm from './form.svelte';
</script>

<svelte:head>
  <title>Create your account | Dr. Receipt</title>
</svelte:head>

<section class="p-10 w-full grid grid-cols-12 gap-8">
  <div
    class="hidden md:block rounded-lg text-gray-300
              col-span-6 md:col-span-6 xl:col-span-6">
    <Benefits />
  </div>

  <div class="col-span-12 md:col-span-6 xl:col-span-6">
    <RegisterForm />
  </div>
</section>
