
export interface Vendor {
    /**
     * @readonly
     * Unique ID of vendor
     */
    readonly 'vendorId': string;
    /**
     * @readonly
     * Name of vendor
     */
    readonly 'vendorName': string;
    /**
     * @readonly
     * Location of Vendor
     */ 
    readonly 'vendorLocation': string;

    readonly 'postalCode': number;
  }