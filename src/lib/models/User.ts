import type { Metadata } from '$lib/models';

interface User {
  readonly uid: string;
  readonly uen: string | null;
  readonly tenantId: string | null;
  readonly emailVerified: boolean;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata: Metadata;
}

export type { User };
