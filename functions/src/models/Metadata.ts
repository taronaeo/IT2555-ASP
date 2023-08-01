import { FieldValue } from 'firebase-admin/firestore';

interface Metadata {
  updatedAt: FieldValue;
  readonly createdAt: FieldValue;
}

export type { Metadata };
export { FieldValue };
