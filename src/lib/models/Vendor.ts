export interface Vendor {
  readonly vendorId: string;
  readonly vendorUen: string;
  vendorName: string;
  vendorEmail: string;
  vendorCategory: string;
  vendorPhoneNumber: string;
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
