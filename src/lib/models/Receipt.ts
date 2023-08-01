import type { FieldValue } from "firebase/firestore"; 

export interface Receipt {
    /**
     * @readonly
     * Unique ID     of Receipt
     */
    readonly 'receiptId': string;
    /**
     * @readonly
     * Vendor Details
     */
    readonly 'vendor': {vendorId: string; vendorLocation: string; vendorName: string; postalCode: number;}
    /**
     * @readonly
     * Unique ID of User
     */
    'userUid': string|null;
    /**
     * @readonly
     * Array of Items bought
     */
    readonly 'items': Array<{itemName: string; price: number; discount: string|null; remarks: string|null;}>;
    /**
     * @readonly
     * Subtotal of Purchase
     */
    readonly 'subtotal': number;
    /**
     * @readonly
     * GST
     */
    readonly 'gst': number;
    /**
     * @readonly
     * Total price of purchase
     */
    readonly 'total': number;
    /**
     * @readonly
     * Receipt creation timestamp
     */
    readonly createdAt: FieldValue;
    /**
     * @readonly
     * Payment Method Used
     */
    readonly 'paymentMethod': string;
    /**
     * @readonly
     * Change
     */
    readonly 'change': number,
  }
