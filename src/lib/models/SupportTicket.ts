import type { Metadata } from './Metadata';

export interface SupportTicket extends Pick<Metadata, 'createdAt'> {
  readonly ticketId: string;
  readonly userUid: string;
  readonly inquiryType: string;
  readonly inquiryDesc: string;
  isResolved: boolean;
}
