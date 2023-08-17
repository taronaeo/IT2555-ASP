<!-- Settings.svelte -->
<script>
  import { firestore } from '$lib/firebase';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { authStore } from '$lib/stores';
  import { isValidNumber } from 'libphonenumber-js';

  let valid = false;
  let user = {};
  let errors = { displayName: '', email: '', phoneNumber: '' };
  const userUid = $authStore?.uid;

  let isModalVisible = false;

  function closeModal() {
    isModalVisible = false;
    location.reload();
  }

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function isValidPhoneNumber(phoneNumber) {
    const phonePattern = /^[89]\d{7}$/;
    return phonePattern.test(phoneNumber);
  }

  const validateForm = () => {
    valid = true;
    errors = { displayName: '', email: '', phoneNumber: '' };

    if (user.displayName.trim().length < 1) {
      valid = false;
      errors.displayName = 'Display name cannot be empty.';
    }

    if (user.email.trim().length < 1) {
      valid = false;
      errors.email = 'Email cannot be empty';
    } else if (!isValidEmail(user.email)) {
      valid = false;
      errors.email = 'Please enter a valid email address.';
    }

    if (user.phoneNumber.trim().length < 1) {
      valid = false;
      errors.phoneNumber = 'Phone number cannot be empty';
    } else if (!isValidPhoneNumber(user.phoneNumber)) {
      valid = false;
      errors.phoneNumber =
        'Please enter a valid Singapore phone number starting with 8 or 9.';
    }

    return valid;
  };

  async function getUser() {
    const docRef = doc(firestore, 'users', userUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      user = docSnap.data(); // Assign the data to the user object
    } else {
      console.error('User document not found');
    }
  }

  getUser();

  async function saveSettings() {
    if (!validateForm()) {
      return;
    }

    const newData = {
      data: {
        userUid: userUid,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };

    try {
      const response = await fetch(
        'https://us-central1-it2555-asp.cloudfunctions.net/settingsValidationCall',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error.message);
      }

      const result = await response.json();
      const serverResponse = result.result;
      // Check if server validation is successful for all fields
      if (
        serverResponse.displayName === true &&
        serverResponse.email === true &&
        serverResponse.phoneNumber === true
      ) {
        const docRef = doc(firestore, 'users', userUid);
        const newData = {
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        };

        try {
          await setDoc(docRef, newData, { merge: true });
          isModalVisible = true;
          console.log('Settings saved successfully!');
        } catch (error) {
          console.error('Error saving settings:', error);
        }
      }

      // If the server validation is successful, show the success modal
      isModalVisible = true;
    } catch (error) {
      console.error('Error saving settings:', error.message);
    }
  }
</script>

<svelte:head>
  <title>Dashboard ∙ Personal Information | Dr. Receipts</title>
</svelte:head>

{#if isModalVisible}
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-gray-800 opacity-50" />
    <div class="bg-white p-6 rounded-md shadow-md text-center relative">
      <p class="text-lg font-semibold mb-2">Changes saved successfully!</p>
      <p class="text-gray-600">Your settings have been updated.</p>
      <div class="mt-4">
        <button
          type="button"
          class="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 mx-auto"
          on:click={closeModal}>Close</button>
      </div>
    </div>
  </div>
{/if}

<main class="flex items-center p-4">
  <div class="w-full max-w-xl bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-semibold text-center pt-6"
      >Personal Information</h1>

    <form class="p-6">
      <div class="mb-4">
        <label for="displayName" class="block text-sm font-medium text-gray-700"
          >Display Name</label>
        <input
          type="text"
          id="displayName"
          bind:value={user.displayName}
          disabled={$authStore?.tenantId !== null}
          class="mt-1 p-2 border rounded-md w-full" />
        {#if errors.displayName}
          <p class="text-red-500 text-sm mt-1">{errors.displayName}</p>
        {/if}
      </div>

      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label>
        <input
          type="email"
          id="email"
          bind:value={user.email}
          disabled={$authStore?.tenantId !== null}
          class="mt-1 p-2 border rounded-md w-full" />
        {#if errors.email}
          <p class="text-red-500 text-sm mt-1">{errors.email}</p>
        {/if}
      </div>

      <div class="mb-4">
        <label for="phoneNumber" class="block text-sm font-medium text-gray-700"
          >Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          placeholder="Enter your phone number: "
          maxlength="11"
          bind:value={user.phoneNumber}
          disabled={$authStore?.tenantId !== null}
          class="mt-1 p-2 border rounded-md w-full" />
        {#if errors.phoneNumber}
          <p class="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        {/if}
      </div>

      <div class="flex justify-center">
        <button
          type="button"
          class="px-8 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
          on:click={saveSettings}>Save</button>
      </div>
    </form>
  </div>
</main>
