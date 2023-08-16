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
    price: string;
    discount: string | null;
    remarks: string | null;
  }>;
  readonly subtotal: string;
  readonly gst: string;
  readonly total: string;
  readonly paymentMethod: string;
  readonly change: string;
}
