import type { list } from "postcss";

export interface ReceiptItem {
    /**
     * @readonly
     * Unique ID of Receipt
     */
    readonly 'itemId': string;
    /**
     * @readonly
     * Name of Item
    */
    readonly 'itemName': string;
    /**
     * @readonly
     * Price of Item
     */

    readonly 'price': number;
  }