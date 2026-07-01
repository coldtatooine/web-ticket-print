"use client";

import { useRef } from "react";

import { PrinterPanel } from "@/components/PrinterPanel";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import type { PrinterConnectionType } from "@/types/printer";

interface PrinterSettingsProps {
  connected: boolean;
  deviceName: string | null;
  connectionType: PrinterConnectionType | null;
  isConnecting: boolean;
  isSupported: (type: PrinterConnectionType) => boolean;
  onConnect: (type: PrinterConnectionType) => Promise<void>;
  onDisconnect: () => Promise<void>;
}

function PrinterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </svg>
  );
}

export function PrinterSettings(props: PrinterSettingsProps) {
  const copy = useCopy();
  const { connected } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button
        type="button"
        variant="neutral"
        size="icon"
        className="relative rounded-full"
        onClick={open}
        aria-label={
          connected
            ? copy.printer.settingsButtonLabelConnected
            : copy.printer.settingsButtonLabelDisconnected
        }
      >
        <PrinterIcon />
        <span
          aria-hidden
          className={cn(
            "absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-border",
            connected ? "bg-status-done" : "bg-status-critical",
          )}
        />
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="printer-settings-title"
        className="fixed inset-0 z-50 m-auto max-h-[85vh] w-[calc(100%-2.5rem)] max-w-md overflow-hidden rounded-base border-2 border-border bg-background p-0 shadow-shadow open:flex open:flex-col backdrop:bg-overlay"
        onCancel={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            close();
          }
        }}
      >
        <div className="max-h-[85vh] overflow-y-auto">
          <div className="flex justify-end px-4 pt-4">
            <Button type="button" variant="noShadow" size="sm" onClick={close}>
              {copy.app.helpClose}
            </Button>
          </div>
          <PrinterPanel embedded {...props} />
        </div>
      </dialog>
    </>
  );
}
