import type { Metadata } from './Metadata';

export interface Receipt extends Pick<Metadata, 'createdAt'> {
  userUid: string | null;
  readonly receiptId: string;
  readonly vendor: {
    vendorId: string;
    vendorLocation: string;
    vendorName: string;
    postalCode: string;
  };
  readonly items: Array<{
    itemName: string;
    price: number;
    discount: string | null;
    remarks: string | null;
  }>;
  readonly subtotal: number;
  readonly gst: number;
  readonly total: number;
  readonly paymentMethod: string;
  readonly change: number;
  readonly receiptType?: string | null;
}
