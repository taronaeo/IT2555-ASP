<script lang="ts">
  import type { VendorBranch, VendorApiKey } from '$lib/models';

  import { vendorStore } from '$lib/stores';
  import { generateAPIKey } from '$lib/generators';

  import { firestore } from '$lib/firebase';
  import { doc, setDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { authStore } from '$lib/stores';
  import { AuthTenant } from '$lib/constants';

  import { z } from 'zod';
  import { createForm } from 'svelte-forms-lib';
  import { validateZod } from '$lib/forms';
  import { Modal, FormInput } from '$lib/components';

  let showAddBranchModal: boolean = false;
  let selectedBranchDelete: VendorBranch = {} as VendorBranch;
  let selectedBranchAPIShow: VendorApiKey = {} as VendorApiKey;

  $: branches = $vendorStore?.branches || [];
  $: (async () => {
    if (browser && !$authStore) return;
    if (browser && $authStore && $authStore.tenantId !== AuthTenant.VENDOR) {
      return await goto('/dashboard', { replaceState: true });
    }
  })();

  const onAPIShowCancel = () => (selectedBranchAPIShow = {} as VendorApiKey);
  const onDeleteCancel = () => (selectedBranchDelete = {} as VendorBranch);

  const schema = z.object({
    branchId: z
      .string()
      .min(2, 'Branch ID must be at least 2 characters')
      .max(30, 'Branch ID must not exceed 30 characters')
      .refine((id) => !id.includes(' '), 'Branch ID must not contain spaces'),
    branchLocation: z
      .string()
      .min(2, 'Branch location must be at least 2 characters'),
    branchPostal: z
      .string()
      .min(
        6,
        'Branch Postal Code invalid. Only valid 6-digit Singapore postal code is allowed'
      )
      .max(
        6,
        'Branch Postal Code invalid. Only valid 6-digit Singapore postal code is allowed'
      )
      .refine(
        (postalCode) => {
          const parsedPostalCode = Number(postalCode);
          if (isNaN(parsedPostalCode)) return false;
          if (parsedPostalCode <= 100000) return false;
          if (parsedPostalCode >= 999999) return false;
          return true;
        },
        {
          message:
            'Invalid postal code. Only valid 6-digital SG postal code is allowed.',
        }
      ),
  }) satisfies z.ZodType<VendorBranch>;

  const {
    form,
    errors,
    isValidating,
    isSubmitting,
    handleChange,
    handleSubmit,
    updateField,
  } = createForm({
    initialValues: {
      branchId: '',
      branchLocation: '',
      branchPostal: '',
    } satisfies VendorBranch,
    validate: (data) => validateZod(schema, data),
    onSubmit: async (data) => {
      if (!$vendorStore) return;
      if (!$vendorStore.branches) return;

      const branches = $vendorStore.branches;
      const transformed = schema.parse(data);

      const exists = branches.some(
        (branch) => branch.branchId === transformed.branchId
      );
      if (exists) {
        return toggleShowAddBranch();
      }

      const vendorRef = doc(firestore, 'vendors', $vendorStore.vendorId);
      const newAPIKey: VendorApiKey = {
        branchId: transformed.branchId,
        key: generateAPIKey(),
        secret: generateAPIKey(),
      };

      try {
        await setDoc(
          vendorRef,
          { branches: arrayUnion(transformed) },
          { merge: true }
        );

        await setDoc(
          vendorRef,
          { apiKeys: arrayUnion(newAPIKey) },
          { merge: true }
        );
      } catch (error) {
        console.error(error);
      }

      return toggleShowAddBranch();
    },
  });

  function toggleShowAddBranch() {
    updateField('branchId', '');
    updateField('branchLocation', '');
    updateField('branchPostal', '');
    showAddBranchModal = !showAddBranchModal;
  }

  async function onAPIShowClick(branchId: string, revoke: boolean = false) {
    if (!$vendorStore) return;
    if (!$vendorStore.apiKeys) return;

    const apiKeys = $vendorStore.apiKeys;
    apiKeys.forEach((key) => {
      if (key.branchId === branchId) return (selectedBranchAPIShow = key);
    });

    if (!revoke) return;
    const vendorRef = doc(firestore, 'vendors', $vendorStore.vendorId);
    const newAPIKey: VendorApiKey = {
      branchId: branchId,
      key: generateAPIKey(),
      secret: generateAPIKey(),
    };

    try {
      await setDoc(
        vendorRef,
        {
          apiKeys: arrayRemove(selectedBranchAPIShow),
        },
        { merge: true }
      );

      await setDoc(
        vendorRef,
        {
          apiKeys: arrayUnion(newAPIKey),
        },
        { merge: true }
      );
    } catch (err) {
      console.error(err);
    }

    return onAPIShowCancel();
  }

  async function onDeleteClick(branchId: string, confirmed: boolean = false) {
    if (!$vendorStore) return;
    if (!$vendorStore.branches) return;

    const branches = $vendorStore.branches;
    branches.forEach((branch) => {
      if (branch.branchId === branchId) return (selectedBranchDelete = branch);
    });

    if (!confirmed) return;
    const vendorRef = doc(firestore, 'vendors', $vendorStore.vendorId);
    await setDoc(
      vendorRef,
      { branches: arrayRemove(selectedBranchDelete) },
      { merge: true }
    );

    return onDeleteCancel();
  }
</script>

<svelte:head>
  <title>Dashboard ∙ Branches</title>
</svelte:head>

<!-- <pre>{JSON.stringify($vendorStore, null, 2)}</pre> -->

{#if showAddBranchModal}
  <form on:submit|preventDefault={handleSubmit} novalidate>
    <Modal onClickCancel={toggleShowAddBranch}>
      <h3 slot="title" class="leading-6 font-semibold">Create Branch</h3>

      <div slot="body" class="space-y-4">
        <FormInput
          id="branchId"
          type="text"
          label="Branch ID"
          labelClass="text-sm text-gray-900 font-medium"
          placeholder="Enter the branch identifier..."
          errorMessage={$errors.branchId}
          disabled={$isValidating || $isSubmitting}
          on:change={handleChange}
          bind:value={$form.branchId} />

        <FormInput
          id="branchLocation"
          type="text"
          label="Branch Location"
          labelClass="text-sm text-gray-900 font-medium"
          placeholder="Enter the branch location..."
          errorMessage={$errors.branchLocation}
          disabled={$isValidating || $isSubmitting}
          on:change={handleChange}
          bind:value={$form.branchLocation} />

        <FormInput
          id="branchPostal"
          type="tel"
          label="Branch Postal Code"
          labelClass="text-sm text-gray-900 font-medium"
          placeholder="Enter the branch postal code..."
          errorMessage={$errors.branchPostal}
          disabled={$isValidating || $isSubmitting}
          on:change={handleChange}
          bind:value={$form.branchPostal} />
      </div>

      <svelte:fragment slot="buttonExecute">Create</svelte:fragment>
      <svelte:fragment slot="buttonCancel">Cancel</svelte:fragment>
    </Modal>
  </form>
{/if}

{#if Object.keys(selectedBranchDelete).length}
  <Modal
    onClickExecute={() => onDeleteClick(selectedBranchDelete.branchId, true)}
    onClickCancel={onDeleteCancel}>
    <h3 slot="title" class="leading-6 font-semibold">
      Delete {selectedBranchDelete.branchId}?
    </h3>

    <p slot="body" class="text-sm text-gray-500">
      Are you sure you want to delete branch {selectedBranchDelete.branchId}?
      All requests will fail once deleted. This action cannot be undone.
    </p>

    <svelte:fragment slot="buttonExecute">Delete</svelte:fragment>
    <svelte:fragment slot="buttonCancel">Cancel</svelte:fragment>
  </Modal>
{/if}

{#if Object.keys(selectedBranchAPIShow).length}
  <Modal
    onClickExecute={() => onAPIShowClick(selectedBranchAPIShow.branchId, true)}
    onClickCancel={onAPIShowCancel}>
    <h3 slot="title" class="leading-6 font-semibold">
      Reveal API Key for {selectedBranchAPIShow.branchId}
    </h3>

    <svelte:fragment slot="body">
      <p class="text-sm text-gray-500 leading-loose">
        API Key:
        <code class="mb-1 px-1.5 py-1 rounded-md bg-gray-100">
          {selectedBranchAPIShow.key}
        </code>
      </p>

      <p class="text-sm text-gray-500 leading-loose">
        API Secret:
        <code class="px-1 py-1 rounded-md bg-gray-100">
          {selectedBranchAPIShow.secret}
        </code>
      </p>
    </svelte:fragment>

    <svelte:fragment slot="buttonExecute">Revoke & Regenerate</svelte:fragment>
    <svelte:fragment slot="buttonCancel">Done</svelte:fragment>
  </Modal>
{/if}

{#if $authStore && $authStore.tenantId === AuthTenant.VENDOR}
  <div class="mb-10">
    <h1 class="text-3xl font-bold">Branches</h1>
    <p class="text-sm">Manage branches and respective API keys</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each branches as branch}
      <div
        class="shadow-lg rounded-lg
              border border-gray-200 overflow-hidden">
        <div class="p-6">
          <h3 class="leading-6 font-semibold">
            {branch.branchId}
          </h3>

          <div class="mt-2">
            <p class="text-sm text-gray-500">
              {branch.branchLocation} ∙ S({branch.branchPostal})
            </p>
          </div>
        </div>

        <div
          class="p-4 bg-gray-50
                sm:flex sm:flex-row-reverse">
          <button
            on:click={() => onDeleteClick(branch.branchId)}
            type="button"
            class="px-3 py-2 w-full shadow-sm rounded-md
                  text-sm text-white font-semibold bg-red-600 hover:bg-red-500
                  inline-flex justify-center sm:ml-3 sm:w-auto">
            Delete
          </button>

          <button
            on:click={() => onAPIShowClick(branch.branchId)}
            type="button"
            class="mt-3 px-3 py-2 w-full shadow-sm rounded-md
                  text-sm font-semibold bg-white hover:bg-gray-50
                  ring-1 ring-inset ring-gray-300
                  inline-flex justify-center sm:mt-0 sm:w-auto">
            Show API Key
          </button>
        </div>
      </div>
    {/each}

    <button
      on:click={toggleShowAddBranch}
      class="text-left shadow-lg rounded-lg
            border-2 border-gray-200 border-dashed overflow-hidden
            hover:bg-gray-50 transition-colors">
      <div class="p-6">
        <h3 class="leading-6 font-semibold">Add new branch</h3>

        <div class="mt-2">
          <p class="text-sm text-gray-500">Click to add a new branch</p>
        </div>
      </div>
    </button>
  </div>
{/if}
