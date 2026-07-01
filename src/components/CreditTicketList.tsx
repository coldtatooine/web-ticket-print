"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopy } from "@/contexts/LocaleContext";
import { filterCreditTickets } from "@/lib/filter-credit-tickets";
import { parseTicketLinksFile } from "@/lib/import-ticket-links";
import { cn } from "@/lib/utils";
import type { ImportedCreditTicket } from "@/types/credit-import";

interface CreditTicketListProps {
  tickets: ImportedCreditTicket[];
  selectedId: string | null;
  onSelect: (ticket: ImportedCreditTicket) => void;
  onImport: (rows: Awaited<ReturnType<typeof parseTicketLinksFile>>["rows"]) => void;
  onClear: () => void;
}

function truncateUrl(url: string, max = 48): string {
  if (url.length <= max) {
    return url;
  }

  return `${url.slice(0, max - 1)}…`;
}

export function CreditTicketList({
  tickets,
  selectedId,
  onSelect,
  onImport,
  onClear,
}: CreditTicketListProps) {
  const copy = useCopy();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterStickySentinelRef = useRef<HTMLDivElement>(null);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [filter, setFilter] = useState("");
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const filteredTickets = useMemo(
    () => filterCreditTickets(tickets, filter),
    [filter, tickets],
  );

  const printedCount = tickets.filter((ticket) => ticket.printed).length;
  const isFiltering = filter.trim().length > 0;

  useEffect(() => {
    const sentinel = filterStickySentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFilterSticky(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportMessage(null);

    try {
      const result = await parseTicketLinksFile(file);

      if (result.rows.length === 0) {
        setImportError(copy.credit.list.importEmpty);
        return;
      }

      onImport(result.rows);

      const skippedPart =
        result.skipped > 0
          ? ` ${copy.credit.list.importSkipped(result.skipped)}`
          : "";

      setImportMessage(
        `${copy.credit.list.importSuccess(result.rows.length)}${skippedPart}`,
      );
    } catch {
      setImportError(copy.credit.list.importFailed);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.credit.list.title}</CardTitle>
        <CardDescription>{copy.credit.list.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div ref={filterStickySentinelRef} className="h-px" aria-hidden />
        <div
          className={cn(
            "sticky top-0 z-10 space-y-2 rounded-base bg-background transition-[padding,box-shadow] duration-200",
            isFilterSticky
              ? "pb-4 shadow-[0_10px_20px_-12px_rgba(10,10,10,0.18)] rounded-none"
              : "pb-1 shadow-none",
          )}
        >
          <Label htmlFor="ticket_filter">{copy.credit.list.filterLabel}</Label>
          <div className="flex gap-2">
            <Input
              id="ticket_filter"
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder={copy.credit.list.filterPlaceholder}
              className="min-w-0 flex-1"
              autoComplete="off"
              spellCheck={false}
            />
            {isFiltering ? (
              <Button
                type="button"
                variant="noShadow"
                size="sm"
                className="shrink-0"
                onClick={() => setFilter("")}
              >
                {copy.credit.list.filterClear}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={(event) => void handleFileChange(event)}
          />
          <Button
            type="button"
            variant="neutral"
            size="sm"
            disabled={isImporting}
            onClick={() => fileInputRef.current?.click()}
          >
            {isImporting ? copy.credit.list.importing : copy.credit.list.importButton}
          </Button>
          {tickets.length > 0 ? (
            <Button type="button" variant="noShadow" size="sm" onClick={onClear}>
              {copy.credit.list.clearButton}
            </Button>
          ) : null}
        </div>

        {importMessage ? (
          <p className="rounded-base border-2 border-status-done bg-status-done-bg px-3 py-2 text-sm text-status-done">
            {importMessage}
          </p>
        ) : null}

        {importError ? (
          <p className="rounded-base border-2 border-status-critical bg-status-critical-bg px-3 py-2 text-sm text-status-critical">
            {importError}
          </p>
        ) : null}

        <p className="text-sm text-foreground/70">
          {isFiltering
            ? copy.credit.list.filterStats(filteredTickets.length, tickets.length)
            : copy.credit.list.stats(tickets.length, printedCount)}
        </p>

        <ul className="space-y-2">
          {filteredTickets.length === 0 ? (
            <li className="rounded-base border-2 border-dashed border-border px-4 py-8 text-center text-sm text-foreground/70">
              {tickets.length === 0
                ? copy.credit.list.empty
                : copy.credit.list.noResults}
            </li>
          ) : (
            filteredTickets.map((ticket) => (
              <li key={ticket.id}>
                <button
                  type="button"
                  onClick={() => onSelect(ticket)}
                  className={cn(
                    "w-full rounded-base border-2 px-3 py-3 text-left transition-colors",
                    selectedId === ticket.id
                      ? "border-main bg-main/20"
                      : "border-border bg-secondary-background hover:bg-main/10",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="break-all text-sm font-base">{truncateUrl(ticket.url)}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-base border px-2 py-0.5 text-xs font-base",
                        ticket.printed
                          ? "border-status-done bg-status-done-bg text-status-done"
                          : "border-border bg-background text-foreground/80",
                      )}
                    >
                      {ticket.printed
                        ? copy.credit.list.statusPrinted
                        : copy.credit.list.statusPending}
                    </span>
                  </div>
                  {ticket.eventName ? (
                    <p className="mt-1 text-xs text-foreground/70">{ticket.eventName}</p>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
