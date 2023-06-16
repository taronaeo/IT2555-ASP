import type { list } from "postcss";
import type { ReceiptItem } from "./item";
import type { Vendor } from "./vendor";

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
    readonly 'vendor': Vendor;
    /**
     * @readonly
     * Unique ID of User
     */
    readonly 'userUid': string;
    /**
     * @readonly
     * Array of Items bought
     */
    readonly 'items': ReceiptItem[] ;
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
     * Date of purchase
     */
    readonly 'date': string;
    /**
     * @readonly
     * Time of purchase
     */
    readonly 'time': string;
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