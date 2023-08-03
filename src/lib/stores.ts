import type { User as UserDoc, Vendor } from '$lib/models';
import type { User as AuthUser } from 'firebase/auth';

import { doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { derived, readable, type Readable } from 'svelte/store';

import { auth } from '$lib/firebase';
import { colUsers, colVendors, docStore } from '$lib/firebase/firestore';

const authState = readable<AuthUser | null>(undefined, (set) => {
  if (typeof window === 'undefined') return;

  const unsubscribe = onAuthStateChanged(auth, set);
  return unsubscribe;
});

export const authStore: Readable<UserDoc | null | undefined> = derived(
  authState,
  ($user, set) => {
    if (typeof window === 'undefined') return;
    if (!$user) return set($user);

    const ref = doc(colUsers, $user.uid);
    return docStore<UserDoc>(ref).subscribe(set);
  }
);

export const vendorStore: Readable<Vendor | null | undefined> = derived(
  [authState, authStore],
  ([$authState, $authStore], set) => {
    if (typeof window === 'undefined') return;
    if (!$authState) return set($authState);
    if (!$authStore) return set($authStore);
    if (!$authStore.vendorId) return set(null);

    const ref = doc(colVendors, $authStore.vendorId);
    return docStore<Vendor>(ref).subscribe(set);
  }
);
