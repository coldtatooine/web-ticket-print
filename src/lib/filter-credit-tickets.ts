import type { ImportedCreditTicket } from "@/types/credit-import";

function extractReferralCode(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("code");
  } catch {
    return null;
  }
}

function matchesStatusQuery(ticket: ImportedCreditTicket, query: string): boolean {
  const pendingTerms = ["pendente", "pending", "nao impresso", "não impresso", "nao impressa"];
  const printedTerms = ["impresso", "impressa", "printed", "done"];

  if (pendingTerms.some((term) => query.includes(term))) {
    return !ticket.printed;
  }

  if (printedTerms.some((term) => query.includes(term))) {
    return ticket.printed;
  }

  return false;
}

function ticketSearchText(ticket: ImportedCreditTicket): string {
  const parts = [
    ticket.url,
    ticket.eventName ?? "",
    extractReferralCode(ticket.url) ?? "",
  ];

  return parts.join(" ").toLocaleLowerCase("pt-BR");
}

export function filterCreditTickets(
  tickets: ImportedCreditTicket[],
  query: string,
): ImportedCreditTicket[] {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  if (!normalized) {
    return tickets;
  }

  return tickets.filter((ticket) => {
    if (ticketSearchText(ticket).includes(normalized)) {
      return true;
    }

    return matchesStatusQuery(ticket, normalized);
  });
}
