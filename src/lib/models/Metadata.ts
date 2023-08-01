import type { FieldValue } from 'firebase/firestore';

interface Metadata {
  updatedAt: FieldValue;
  readonly createdAt: FieldValue;
}

export type { Metadata };
