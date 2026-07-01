export interface CreditTicketPayload {
  eventName: string;
  creditLink: string;
}

export interface CreditTicketValidationResult {
  valid: boolean;
  error?: string;
}
