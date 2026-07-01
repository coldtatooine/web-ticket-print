export interface TicketPayload {
  fromName: string;
  question: string;
}

export interface TicketValidationResult {
  valid: boolean;
  error?: string;
}
