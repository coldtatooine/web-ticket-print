import { MAX_NAME_LENGTH, MAX_QUESTION_LENGTH } from "@/lib/constants";
import type { Copy } from "@/lib/i18n/types";
import type { TicketPayload, TicketValidationResult } from "@/types/ticket";

export function validateTicket(
  { fromName, question }: TicketPayload,
  copy: Copy,
): TicketValidationResult {
  const name = fromName.trim();
  const text = question.trim();

  if (!name) {
    return { valid: false, error: copy.validation.nameRequired };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return {
      valid: false,
      error: copy.validation.nameTooLong,
    };
  }

  if (!text) {
    return { valid: false, error: copy.validation.questionRequired };
  }

  if (text.length > MAX_QUESTION_LENGTH) {
    return {
      valid: false,
      error: copy.validation.questionTooLong,
    };
  }

  return { valid: true };
}
