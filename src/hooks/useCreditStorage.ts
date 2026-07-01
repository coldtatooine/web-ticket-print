"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  loadCreditEvents,
  loadCreditTickets,
  markTicketPrinted,
  markTicketPrintedByUrl,
  mergeCreditTickets,
  saveCreditEvents,
  saveCreditTickets,
  upsertCreditEvent,
} from "@/lib/storage/credit-storage";
import { toImportedTickets } from "@/lib/import-ticket-links";
import type { ParsedImportRow } from "@/lib/import-ticket-links";
import type { CreditEventEntry, ImportedCreditTicket } from "@/types/credit-import";

type CreditStorageSnapshot = {
  tickets: ImportedCreditTicket[];
  events: CreditEventEntry[];
};

let snapshot: CreditStorageSnapshot = { tickets: [], events: [] };
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function hydrateFromStorage() {
  snapshot = {
    tickets: loadCreditTickets(),
    events: loadCreditEvents(),
  };
  emitChange();
}

function getServerSnapshot(): CreditStorageSnapshot {
  return { tickets: [], events: [] };
}

function getClientSnapshot(): CreditStorageSnapshot {
  if (listeners.size === 0 && snapshot.tickets.length === 0 && snapshot.events.length === 0) {
    hydrateFromStorage();
  }

  return snapshot;
}

function persistTickets(next: ImportedCreditTicket[]) {
  snapshot = { ...snapshot, tickets: next };
  saveCreditTickets(next);
  emitChange();
}

function persistEvents(next: CreditEventEntry[]) {
  snapshot = { ...snapshot, events: next };
  saveCreditEvents(next);
  emitChange();
}

export function useCreditStorage() {
  const { tickets, events } = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const hydrated = useSyncExternalStore(
    subscribe,
    () => typeof window !== "undefined",
    () => false,
  );

  const importRows = useCallback((rows: ParsedImportRow[]) => {
    const incoming = toImportedTickets(rows);
    const merged = mergeCreditTickets(snapshot.tickets, incoming);
    persistTickets(merged);
    return { imported: incoming.length, total: merged.length };
  }, []);

  const markPrinted = useCallback((ticketId: string | null, url: string) => {
    const next = ticketId
      ? markTicketPrinted(snapshot.tickets, ticketId)
      : markTicketPrintedByUrl(snapshot.tickets, url);
    persistTickets(next);
  }, []);

  const registerEvent = useCallback((name: string) => {
    const next = upsertCreditEvent(snapshot.events, name);
    if (next !== snapshot.events) {
      persistEvents(next);
    }
  }, []);

  const clearTickets = useCallback(() => {
    persistTickets([]);
  }, []);

  return {
    tickets,
    events,
    hydrated,
    importRows,
    markPrinted,
    registerEvent,
    clearTickets,
  };
}
