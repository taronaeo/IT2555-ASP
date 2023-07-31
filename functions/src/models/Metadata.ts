import { FieldValue } from 'firebase-admin/firestore';

interface Metadata {
  onboarded: boolean;
  updatedAt: FieldValue;
  readonly createdAt: FieldValue;
}

export type { Metadata };
export { FieldValue };
