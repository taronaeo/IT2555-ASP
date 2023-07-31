import type { FieldValue } from 'firebase/firestore';

interface Metadata {
  onboarded: boolean;
  updatedAt: FieldValue;
  readonly createdAt: FieldValue;
}

export type { Metadata };
