import type { User } from 'firebase/auth';

import { writable } from 'svelte/store';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '$lib/firebase';

export const authStore = writable<User | null>(undefined, (set) => {
  if (typeof window === 'undefined') return;
  onAuthStateChanged(auth, set, console.error);
});
