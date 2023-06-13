import type { Metadata } from '$lib/models';

interface User {
  readonly uid: string;
  readonly tenantId: string | null;
  photoURL: string | null;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  metadata: Metadata;
}

export type { User };
