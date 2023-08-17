import type { FieldValue } from './Metadata';

export interface Vendor {
  readonly vendorId: string;
  readonly vendorUen: string;
  vendorName: string;
  vendorEmail: string;
  vendorCategory: string;
  vendorPhoneNumber: string;

  stripeId: string;
  stripeSubscriptionId: string;
  stripeStatus: string;
  stripeItemId: string;

  isSuspended: boolean;

  branches: VendorBranch[] | null;
  apiKeys: VendorApiKey[] | null;
  branchCreatedAt: FieldValue;
}

export interface VendorBranch {
  readonly branchId: string;
  branchLocation: string;
  branchPostal: string;
}

export interface VendorApiKey {
  readonly branchId: string;
  key: string;
  secret: string;
}
