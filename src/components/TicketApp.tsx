"use client";

import Image from "next/image";
import { useEffect } from "react";

import { AppToolbar } from "@/components/AppToolbar";
import { TicketForm } from "@/components/TicketForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCopy } from "@/contexts/LocaleContext";
import { usePrinter } from "@/hooks/usePrinter";
import { APP_HEADER_LOGO_PATH } from "@/lib/constants";
import { preloadBrandLogo } from "@/lib/load-brand-image";

export function TicketApp() {
  const copy = useCopy();

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
    printTicket,
    clearError,
  } = usePrinter();

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10">
      <AppToolbar
        connected={state.connected}
        deviceName={state.device?.name ?? null}
        connectionType={state.connectionType}
        isConnecting={isConnecting}
        isSupported={isSupported}
        onConnect={connect}
        onDisconnect={disconnect}
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
          {copy.app.title}
        </h1>
        <p className="mt-2 max-w-md mx-auto text-foreground/80 font-base">
          {copy.app.subtitle}
        </p>
      </header>

      <div className="space-y-5">
        <TicketForm
          connected={state.connected}
          isPrinting={isPrinting}
          onSubmit={printTicket}
        />

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
  );
}
