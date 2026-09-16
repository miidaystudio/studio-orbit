export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  amountInCents: number;
}

export interface Invoice {
  id: string;
  invoiceNum: string;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
  stripeUrl?: string;
}

export interface RetainerSummary {
  id: string;
  projectId: string;
  totalHours: number;
  usedHours: number;
  hourlyRateInCents: number;
  cycleStart: string;
  cycleEnd: string;
}
