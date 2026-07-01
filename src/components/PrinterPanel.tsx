"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCopy } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import type { PrinterConnectionType } from "@/types/printer";

interface PrinterPanelProps {
  connected: boolean;
  deviceName: string | null;
  connectionType: PrinterConnectionType | null;
  isConnecting: boolean;
  isSupported: (type: PrinterConnectionType) => boolean;
  onConnect: (type: PrinterConnectionType) => Promise<void>;
  onDisconnect: () => Promise<void>;
  embedded?: boolean;
}

export function PrinterPanel({
  connected,
  deviceName,
  connectionType,
  isConnecting,
  isSupported,
  onConnect,
  onDisconnect,
  embedded = false,
}: PrinterPanelProps) {
  const copy = useCopy();

  return (
    <Card className={cn(embedded && "border-0 shadow-none")}>
      <CardHeader>
        <CardTitle id={embedded ? "printer-settings-title" : undefined}>
          {copy.printer.title}
        </CardTitle>
        <CardDescription>{copy.printer.description}</CardDescription>
      </CardHeader>

      <CardContent
        className={cn("relative space-y-3", isConnecting && "min-h-48")}
      >
        {isConnecting ? (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-base bg-background/90 px-4 text-center"
            role="status"
            aria-live="polite"
          >
            <span
              aria-hidden
              className="size-8 animate-spin rounded-full border-2 border-border border-t-main"
            />
            <p className="text-sm font-base text-foreground/80">
              {copy.printer.connecting}
            </p>
          </div>
        ) : null}

        {connected ? (
          <>
            <div className="rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm">
              <span className="font-heading">{copy.printer.connectedPrefix}</span>{" "}
              {deviceName}
              {connectionType ? (
                <span className="text-foreground/70"> ({connectionType})</span>
              ) : null}
            </div>
            <Button
              type="button"
              variant="neutral"
              className="w-full"
              onClick={() => void onDisconnect()}
            >
              {copy.printer.disconnect}
            </Button>
          </>
        ) : (
          <div className="grid gap-2">
            {copy.printer.connections.map(({ type, label, hint }) => {
              const supported = isSupported(type);

              return (
                <Button
                  key={type}
                  type="button"
                  variant="neutral"
                  disabled={!supported || isConnecting}
                  className="h-auto w-full flex-col items-start gap-1 py-3 text-left"
                  onClick={() => void onConnect(type)}
                >
                  <span className="font-heading">{label}</span>
                  <span className="text-xs font-base opacity-80">{hint}</span>
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
