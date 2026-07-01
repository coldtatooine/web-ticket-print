"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AppToolbar } from "@/components/AppToolbar";
import { CreditTicketForm } from "@/components/CreditTicketForm";
import type { CreditTicketFormValues } from "@/components/CreditTicketForm";
import { CreditTicketList } from "@/components/CreditTicketList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCopy } from "@/contexts/LocaleContext";
import { useCreditStorage } from "@/hooks/useCreditStorage";
import { usePrinter } from "@/hooks/usePrinter";
import { APP_HEADER_LOGO_PATH } from "@/lib/constants";
import { preloadBrandLogo } from "@/lib/load-brand-image";
import type { ImportedCreditTicket } from "@/types/credit-import";
import type { CreditTicketPayload } from "@/types/credit-ticket";

export function CreditTicketApp() {
  const copy = useCopy();
  const {
    tickets,
    events,
    hydrated,
    importRows,
    markPrinted,
    registerEvent,
    clearTickets,
  } = useCreditStorage();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [selectedTicketId, tickets],
  );

  const formInitialValues = useMemo<CreditTicketFormValues>(() => {
    if (!selectedTicket) {
      return { eventName: "", creditLink: "" };
    }

    return {
      eventName: selectedTicket.eventName ?? "",
      creditLink: selectedTicket.url,
    };
  }, [selectedTicket]);

  const formKey = selectedTicketId ?? "manual";

  useEffect(() => {
    preloadBrandLogo();
  }, []);

  const {
    state,
    isConnecting,
    isPrinting,
    error,
    isSupported,
    connect,
    disconnect,
    printCreditTicket,
    clearError,
  } = usePrinter();

  async function handleLogout() {
    await fetch("/api/credito/auth", { method: "DELETE" });
    window.location.reload();
  }

  function handleSelectTicket(ticket: ImportedCreditTicket) {
    setSelectedTicketId(ticket.id);
  }

  function handlePrinted(ticketId: string | null, payload: CreditTicketPayload) {
    markPrinted(ticketId, payload.creditLink);
  }

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-10 text-center text-foreground/70">
        {copy.app.loading}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10">
      <AppToolbar
        connected={state.connected}
        deviceName={state.device?.name ?? null}
        connectionType={state.connectionType}
        isConnecting={isConnecting}
        isSupported={isSupported}
        onConnect={connect}
        onDisconnect={disconnect}
        onLogout={() => void handleLogout()}
      />

      <header className="mb-8 text-center">
        <Image
          src={APP_HEADER_LOGO_PATH}
          alt="Cursor"
          width={160}
          height={40}
          priority
          className="mx-auto mb-5 h-10 w-auto"
        />
        <h1 className="text-3xl font-heading tracking-tight sm:text-4xl">
          {copy.credit.app.title}
        </h1>
        <p className="mt-2 max-w-md mx-auto text-foreground/80 font-base">
          {copy.credit.app.subtitle}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <CreditTicketList
          tickets={tickets}
          selectedId={selectedTicketId}
          onSelect={handleSelectTicket}
          onImport={importRows}
          onClear={() => {
            clearTickets();
            setSelectedTicketId(null);
          }}
        />

        <div className="space-y-5">
          <div className="lg:sticky lg:top-20">
            <CreditTicketForm
              key={formKey}
              connected={state.connected}
              isPrinting={isPrinting}
              events={events}
              initialValues={formInitialValues}
              ticketId={selectedTicketId}
              onSubmit={printCreditTicket}
              onPrinted={handlePrinted}
              onRegisterEvent={registerEvent}
            />
          </div>

          {error ? (
            <Card className="border-status-critical bg-status-critical-bg py-4">
              <CardContent className="flex items-start justify-between gap-3 text-sm text-status-critical">
                <p>{error}</p>
                <Button
                  type="button"
                  variant="noShadow"
                  size="sm"
                  className="shrink-0 bg-status-critical-bg text-status-critical border-status-critical"
                  onClick={clearError}
                >
                  {copy.app.dismissError}
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
