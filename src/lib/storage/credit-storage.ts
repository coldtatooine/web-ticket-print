import type { CreditEventEntry, ImportedCreditTicket } from "@/types/credit-import";

export const CREDIT_TICKETS_STORAGE_KEY = "web-ticket-print-credit-tickets";
export const CREDIT_EVENTS_STORAGE_KEY = "web-ticket-print-credit-events";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadCreditTickets(): ImportedCreditTicket[] {
  return readJson<ImportedCreditTicket[]>(CREDIT_TICKETS_STORAGE_KEY, []);
}

export function saveCreditTickets(tickets: ImportedCreditTicket[]): void {
  writeJson(CREDIT_TICKETS_STORAGE_KEY, tickets);
}

export function loadCreditEvents(): CreditEventEntry[] {
  return readJson<CreditEventEntry[]>(CREDIT_EVENTS_STORAGE_KEY, []);
}

export function saveCreditEvents(events: CreditEventEntry[]): void {
  writeJson(CREDIT_EVENTS_STORAGE_KEY, events);
}

export function mergeCreditTickets(
  existing: ImportedCreditTicket[],
  incoming: Omit<ImportedCreditTicket, "printed">[],
): ImportedCreditTicket[] {
  const byUrl = new Map(existing.map((ticket) => [normalizeUrl(ticket.url), ticket]));

  for (const ticket of incoming) {
    const key = normalizeUrl(ticket.url);
    const current = byUrl.get(key);

    if (current) {
      byUrl.set(key, {
        ...current,
        eventName: ticket.eventName ?? current.eventName,
      });
      continue;
    }

    byUrl.set(key, { ...ticket, printed: false });
  }

  return [...byUrl.values()].sort(
    (a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime(),
  );
}

export function markTicketPrinted(
  tickets: ImportedCreditTicket[],
  ticketId: string,
): ImportedCreditTicket[] {
  return tickets.map((ticket) =>
    ticket.id === ticketId ? { ...ticket, printed: true } : ticket,
  );
}

export function markTicketPrintedByUrl(
  tickets: ImportedCreditTicket[],
  url: string,
): ImportedCreditTicket[] {
  const key = normalizeUrl(url);
  return tickets.map((ticket) =>
    normalizeUrl(ticket.url) === key ? { ...ticket, printed: true } : ticket,
  );
}

export function upsertCreditEvent(
  events: CreditEventEntry[],
  name: string,
): CreditEventEntry[] {
  const trimmed = name.trim();
  if (!trimmed) {
    return events;
  }

  const exists = events.some(
    (event) => event.name.toLocaleLowerCase("pt-BR") === trimmed.toLocaleLowerCase("pt-BR"),
  );

  if (exists) {
    return events;
  }

  const entry: CreditEventEntry = {
    id: crypto.randomUUID(),
    name: trimmed,
    createdAt: new Date().toISOString(),
  };

  return [entry, ...events];
}

function normalizeUrl(url: string): string {
  return url.trim().toLocaleLowerCase();
}
