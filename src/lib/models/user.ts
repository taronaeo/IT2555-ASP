import type { Metadata } from '$lib/models';

interface User extends Metadata {
  readonly uid: string;
  readonly uen: string | null;
  readonly tenantId: string | null;
  readonly emailVerified: boolean;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  isOnboarded: boolean;
  vendorId: string | null;
  
}

export type { User };
