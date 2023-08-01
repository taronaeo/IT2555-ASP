export interface Vendor {
  readonly vendorId: string;
  readonly vendorName: string;
  branches: VendorBranch[] | null;
  apiKeys: VendorApiKey[] | null;
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
