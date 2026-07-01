export interface ImportedCreditTicket {
  id: string;
  url: string;
  eventName?: string;
  printed: boolean;
  importedAt: string;
}

export interface CreditEventEntry {
  id: string;
  name: string;
  createdAt: string;
}
