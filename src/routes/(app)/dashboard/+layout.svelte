<script lang="ts">
  import { AuthGuard } from '$lib/components';

  import { page } from '$app/stores';
  import { authStore, vendorStore } from '$lib/stores';
  import { signOut } from '$lib/firebase/auth';

  $: currentPage = $page.route.id?.split('/').pop();
</script>

<AuthGuard>
  <section>
    <div class="px-5 my-10 mx-auto container">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Left Side -->
        <div
          class="flex flex-col gap-10
                  md:top-28 md:sticky md:self-start">
          <div>
            <img
              class="mb-4 w-20 h-20 aspect-1 rounded-full"
              src="https://ui-avatars.com/api/?name={$authStore?.displayName}"
              alt="Profile" />

            <h2 class="text-xl font-bold">{$authStore?.displayName}</h2>
            <span class="block text-sm text-gray-500">{$authStore?.email}</span>
            <span class="block text-sm text-gray-500">
              {$authStore?.phoneNumber}
            </span>
          </div>

          <div>
            <ul>
              <li class="mb-1">
                <a
                  href="/dashboard"
                  class="text-lg hover:text-emerald-600"
                  class:font-bold={currentPage?.match(/dashboard/g)}
                  class:text-emerald-600={currentPage?.match(/dashboard/g)}>
                  Personal Information
                </a>
              </li>

              <li class="mb-1">
                <a
                  href="/dashboard/receipts"
                  class="text-lg hover:text-emerald-600"
                  class:font-bold={currentPage?.match(/receipts/g)}
                  class:text-emerald-600={currentPage?.match(/receipts/g)}>
                  Receipts
                </a>
              </li>

              {#if $vendorStore}
                <li class="mb-1">
                  <a
                    href="/dashboard/branches"
                    class="text-lg hover:text-emerald-600"
                    class:font-bold={currentPage?.match(/branches/g)}
                    class:text-emerald-600={currentPage?.match(/branches/g)}>
                    Branches
                  </a>
                </li>

                <li class="mb-1">
                  <a
                    href="/dashboard/payment"
                    class="text-lg hover:text-emerald-600"
                    class:font-bold={currentPage?.match(/payment/g)}
                    class:text-emerald-600={currentPage?.match(/payment/g)}>
                    Payment Methods
                  </a>
                </li>
              {/if}
            </ul>
          </div>

          <div>
            <button
              type="button"
              on:click={signOut}
              class="px-4 py-2 rounded-full
                      text-sm text-center text-white font-medium
                      bg-emerald-600 hover:bg-emerald-700
                      focus:outline-none focus:ring-4 focus:ring-emerald-300">
              Sign Out
            </button>
          </div>

          <hr class="md:hidden" />
        </div>

        <!-- Right Side -->
        <div class="md:col-span-3">
          <slot />
        </div>
      </div>
    </div>
  </section>
</AuthGuard>
