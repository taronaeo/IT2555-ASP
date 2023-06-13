import type { list } from "postcss";
import type { ReceiptItem } from "./item";
import type { Vendor } from "./vendor";

export interface Receipt {
    readonly 'receiptId': string;
    /**
     * @readonly
     * Unique ID     of Receipt
     */
    readonly 'vendor': Vendor;
    /**
     * @readonly
     * Unique ID of vendor
     */
    readonly 'userUid': string;
    /**
     * @readonly
     * Unique ID of User
     */
    readonly 'items': ReceiptItem[] ;
    /**
     * @readonly
     * Array of Items bought
     */
    readonly 'subtotal': number;
    /**
     * @readonly
     * Subtotal of Purchase
     */
    readonly 'gst': number;
    /**
     * @readonly
     * GST
     */
    readonly 'total': number;
    /**
     * @readonly
     * Total price of purchase
     */
    readonly 'date': string;
    /**
     * @readonly
     * Date of purchase
     */
    readonly 'time': string;
    /**
     * @readonly
     * Time of purchase
     */
    readonly 'paymentMethod': string;
    /**
     * @readonly
     * Payment Method Used
     */
    readonly 'change': number,
    /**
     * @readonly
     * Change
     */

  }