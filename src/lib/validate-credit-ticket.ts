import {
  MAX_CREDIT_LINK_LENGTH,
  MAX_EVENT_NAME_LENGTH,
} from "@/lib/constants";
import type { Copy } from "@/lib/i18n/types";
import type {
  CreditTicketPayload,
  CreditTicketValidationResult,
} from "@/types/credit-ticket";

export function validateCreditTicket(
  { eventName, creditLink }: CreditTicketPayload,
  copy: Copy,
): CreditTicketValidationResult {
  const name = eventName.trim();
  const link = creditLink.trim();

  if (!name) {
    return { valid: false, error: copy.credit.validation.eventNameRequired };
  }

  if (name.length > MAX_EVENT_NAME_LENGTH) {
    return {
      valid: false,
      error: copy.credit.validation.eventNameTooLong,
    };
  }

  if (!link) {
    return { valid: false, error: copy.credit.validation.creditLinkRequired };
  }

  if (link.length > MAX_CREDIT_LINK_LENGTH) {
    return {
      valid: false,
      error: copy.credit.validation.creditLinkTooLong,
    };
  }

  if (!/^https?:\/\/.+/i.test(link)) {
    return { valid: false, error: copy.credit.validation.creditLinkInvalid };
  }

  return { valid: true };
}
