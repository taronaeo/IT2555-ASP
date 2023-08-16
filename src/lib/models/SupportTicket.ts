import type { FieldValue } from 'firebase/firestore';
import type { Metadata } from './Metadata';

export interface SupportTicket extends Pick<Metadata, 'createdAt'> {
  readonly ticketId: string;
  readonly userUid: string;
  readonly inquiryType: string;
  readonly inquiryDesc: string;
  readonly createdAt: FieldValue;
  isResolved: boolean;
}
