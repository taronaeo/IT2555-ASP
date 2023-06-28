import type { User } from '$lib/models';

import { readable } from 'svelte/store';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '$lib/firebase';
import { usersCol, createStreamDoc } from '$lib/firebase/firestore';

export const authStore = readable<User | null>(undefined, (set) => {
  if (typeof window === 'undefined') return;
  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {
      if (!user) return set(null);

      const { stream } = createStreamDoc(usersCol, user.uid);
      stream(set);
    },
    (err) => console.error(err)
  );

  return unsubscribe;
});
