import type { FieldValue } from 'firebase/firestore';
export interface Vendor {
  readonly vendorId: string;
  readonly vendorName: string;
  category: string;
  branches: VendorBranch[] | null;
  apiKeys: VendorApiKey[] | null;
  branchCreateedAt: FieldValue;
}

export interface VendorBranch {
  readonly branchId: string;
  branchLocation: string;
  branchPostal: number;
}

export interface VendorApiKey {
  readonly branchId: string;
  key: string;
  secret: string;
}
