import type { User } from '$lib/models';
import type {
  Query,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';

import { firestore } from '$lib/firebase';
import { doc, collection, onSnapshot } from 'firebase/firestore';

export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const usersCol = createCollection<User>('users');
export const receiptsCol = createCollection('receipts');

export const createStreamDoc = <T = DocumentData>(
  colRef: CollectionReference<T>,
  docId: string
) => {
  const docRef = doc(colRef, docId);
  const stream = (callback: (data: T) => void) =>
    onSnapshot(docRef, (snap) =>
      callback({ _id: snap.id, ...snap.data() } as T)
    );

  return { stream };
};

export const createStreamCol = <T = DocumentData>(query: Query<T>) => {
  const stream = (callback: (data: T[]) => void) =>
    onSnapshot(query, (snap) =>
      callback(snap.docs.map((doc) => ({ _id: doc.id, ...doc.data() } as T)))
    );

  return { stream };
};
