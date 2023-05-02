import { writable } from 'svelte/store';
import { onAuthStateChanged } from 'firebase/auth';

import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Global app service store
type ServiceStore = { auth: Auth; firestore: Firestore };
export const serviceStore = writable<ServiceStore>();

export function userStore(auth: Auth) {
  let unsubscribe: () => void;

  const { subscribe } = writable(auth.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return { subscribe };
}
