import type { Metadata } from "./metadata"; 

interface User extends Metadata {
  readonly uid: string;
  readonly uen: string | null;
  readonly tenantId: string | null;
  readonly emailVerified: boolean;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  vendorId: string | null;
}

export type { User };