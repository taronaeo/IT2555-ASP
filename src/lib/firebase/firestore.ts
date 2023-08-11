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
import { doc, collection, setDoc, onSnapshot } from 'firebase/firestore';

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

export const createCollection = <T>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const createDoc = <T = DocumentData>(
  colRef: CollectionReference<T>,
  docId: string,
  data: T
) => {
  const docRef = doc(colRef, docId);
  return setDoc(docRef, data, { merge: true });
};

export const createStreamDoc = <T = DocumentData>(
  colRef: CollectionReference<T>,
  docId: string
) => {
  const docRef = doc(colRef, docId);
  const stream = (callback: (data: T) => void) =>
    onSnapshot(docRef, (snap) =>
      callback({ _id: snap.id, _ref: docRef, ...snap.data() } as T)
    );

  return { stream };
};

export const createStreamCol = <T = DocumentData>(query: Query<T>) => {
  const stream = (callback: (data: T[]) => void) =>
    onSnapshot(query, (snap) =>
      callback(
        snap.docs.map(
          (doc) => ({ _id: doc.id, _ref: query, ...doc.data() } as T)
        )
      )
    );

  return { stream };
};

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
