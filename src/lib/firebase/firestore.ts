import type { User } from '$lib/models';
import type {
  Query,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';

import { firestore } from '$lib/firebase';
import { FirestoreCollection } from '$lib/constants';
import { doc, collection, setDoc, onSnapshot } from 'firebase/firestore';

export const colUsers = collection(
  firestore,
  FirestoreCollection.USERS
) as CollectionReference<User>;

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
