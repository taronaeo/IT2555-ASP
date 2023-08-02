import type { Metadata } from '../models/Metadata';

interface User extends Metadata {
  readonly uid: string;
  readonly tenantId: string | null;
  readonly vendorId: string | null;
  readonly emailVerified: boolean;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  isOnboarded: boolean;
}

export type { User };
