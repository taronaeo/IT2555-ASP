import type { Branches } from './branches';
import type { ApiKeys } from './apiKeys';
export interface Vendor {
    /**
     * @readonly
     * Unique ID of vendor
     */
    readonly vendorId: string;
    /**
     * @readonly
     * Name of vendor
     */
    readonly vendorName: string;
    /**
     * @readonly
     * Location of Vendor
     */ 
    branches: Branches[] | null;
    apiKeys: ApiKeys[] | null; 
  }