"use client";

import { LanguageSelector } from "@/components/LanguageSelector";
import { PrinterSettings } from "@/components/PrinterSettings";
import { RequirementsHelp } from "@/components/RequirementsHelp";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/contexts/LocaleContext";
import type { PrinterConnectionType } from "@/types/printer";

interface AppToolbarProps {
  connected: boolean;
  deviceName: string | null;
  connectionType: PrinterConnectionType | null;
  isConnecting: boolean;
  isSupported: (type: PrinterConnectionType) => boolean;
  onConnect: (type: PrinterConnectionType) => Promise<void>;
  onDisconnect: () => Promise<void>;
  onLogout?: () => void;
}

export function AppToolbar({
  onLogout,
  ...printerProps
}: AppToolbarProps) {
  const copy = useCopy();

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      <LanguageSelector />
      <div
        className="h-6 w-px shrink-0 bg-border"
        role="separator"
        aria-orientation="vertical"
      />
      <PrinterSettings {...printerProps} />
      <RequirementsHelp />
      {onLogout ? (
        <Button type="button" variant="noShadow" size="sm" onClick={onLogout}>
          {copy.credit.auth.logout}
        </Button>
      ) : null}
    </div>
  );
}
