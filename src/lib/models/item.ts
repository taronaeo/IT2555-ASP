import type { list } from "postcss";

export interface ReceiptItem {
    readonly 'itemId': string;
    /**
     * @readonly
     * Unique ID of Receipt
     */
    readonly 'itemName': string;
    /**
     * @readonly
     * Name of Item
     */
    readonly 'price': number;
    /**
     * @readonly
     * Price of Item
     */
  }