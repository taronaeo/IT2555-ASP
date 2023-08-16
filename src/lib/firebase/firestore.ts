import type { User, Vendor } from '$lib/models';
import type {
  Query,
  DocumentData,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore';

import { readable } from 'svelte/store';
import { firestore } from '$lib/firebase';
import { FirestoreCollection } from '$lib/constants';
import { doc, collection, onSnapshot } from 'firebase/firestore';

export const colUsers = collection(
  firestore,
  FirestoreCollection.USERS
) as CollectionReference<User>;

export const colVendors = collection(
  firestore,
  FirestoreCollection.VENDORS
) as CollectionReference<Vendor>;

export const colReceipts = collection(
  firestore,
  FirestoreCollection.RECEIPTS
) as CollectionReference<DocumentData>;

export function docStore<T>(pathOrRef: string | DocumentReference) {
  let unsubscribe: () => void;
  let ref: DocumentReference;

  if (typeof pathOrRef !== 'string') ref = pathOrRef;
  else ref = doc(firestore, pathOrRef);

  const { subscribe } = readable<T | null>(undefined, (set) => {
    unsubscribe = onSnapshot(ref, (snap) => set((snap.data() as T) ?? null));
    return () => unsubscribe();
  });

  return {
    subscribe,
    _ref: ref,
    _id: ref.id,
  };
}

export function collectionStore<T>(query: Query) {
  let unsubscribe: () => void;
  let _firstDoc;
  let _lastDoc;

  const { subscribe } = readable<T[] | null>(undefined, (set) => {
    unsubscribe = onSnapshot(query, (snap) =>
      set(snap.docs.map((doc) => doc.data() as T))
    );
    return () => unsubscribe();
  });

  return { subscribe, _firstDoc, _lastDoc };
}
