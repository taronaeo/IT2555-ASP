import type { User as UserDoc } from '$lib/models';
import type { User as AuthUser } from 'firebase/auth';

import { doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { derived, readable, type Readable } from 'svelte/store';

import { auth } from '$lib/firebase';
import { colUsers, docStore } from '$lib/firebase/firestore';

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
