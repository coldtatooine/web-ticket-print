"use client";

import { useCallback, useEffect, useState } from "react";

import { useCopy } from "@/contexts/LocaleContext";
import { printerService } from "@/lib/printer/printer-service";
import type { PrinterConnectionType, PrinterState } from "@/types/printer";
import type { CreditTicketPayload } from "@/types/credit-ticket";
import type { TicketPayload } from "@/types/ticket";

export function usePrinter() {
  const copy = useCopy();
  const [state, setState] = useState<PrinterState>({
    connected: false,
    device: null,
    connectionType: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7770/ingest/83c26a9a-f936-4e91-96c1-b8d2a916f3b9", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "dfd277",
      },
      body: JSON.stringify({
        sessionId: "dfd277",
        location: "usePrinter.ts:mount",
        message: "usePrinter mounted, handlers registered",
        data: {},
        hypothesisId: "C",
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    printerService.setHandlers(
      (device) => {
        setState({
          connected: true,
          device,
          connectionType: device.type,
        });
        setError(null);
        setIsConnecting(false);
      },
      () => {
        // #region agent log
        fetch(
          "http://127.0.0.1:7770/ingest/83c26a9a-f936-4e91-96c1-b8d2a916f3b9",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "dfd277",
            },
            body: JSON.stringify({
              sessionId: "dfd277",
              location: "usePrinter.ts:onDisconnected",
              message: "UI disconnected handler fired",
              data: {
                visibilityState: document.visibilityState,
              },
              hypothesisId: "A",
              timestamp: Date.now(),
            }),
          },
        ).catch(() => {});
        // #endregion
        setState({
          connected: false,
          device: null,
          connectionType: null,
        });
        setIsConnecting(false);
      },
    );

    const onVisibilityChange = () => {
      // #region agent log
      fetch(
        "http://127.0.0.1:7770/ingest/83c26a9a-f936-4e91-96c1-b8d2a916f3b9",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "dfd277",
          },
          body: JSON.stringify({
            sessionId: "dfd277",
            location: "usePrinter.ts:visibilitychange",
            message: "tab visibility changed",
            data: {
              visibilityState: document.visibilityState,
              hidden: document.hidden,
              connected: printerService.getState().connected,
            },
            hypothesisId: "D",
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
      // #endregion
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      // #region agent log
      fetch(
        "http://127.0.0.1:7770/ingest/83c26a9a-f936-4e91-96c1-b8d2a916f3b9",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "dfd277",
          },
          body: JSON.stringify({
            sessionId: "dfd277",
            location: "usePrinter.ts:unmount",
            message: "usePrinter unmounting, handlers cleared",
            data: {
              connected: printerService.getState().connected,
            },
            hypothesisId: "C",
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
      // #endregion
      document.removeEventListener("visibilitychange", onVisibilityChange);
      printerService.setHandlers(
        () => undefined,
        () => undefined,
      );
    };
  }, []);

  const isSupported = useCallback((type: PrinterConnectionType) => {
    return printerService.isSupported(type);
  }, []);

  const connect = useCallback(
    async (type: PrinterConnectionType) => {
      setIsConnecting(true);
      setError(null);

      try {
        await printerService.connect(type);
      } catch (err) {
        setIsConnecting(false);
        const message =
          err instanceof Error ? err.message : copy.errors.connectFailed;
        setError(message);
        throw err;
      }
    },
    [copy.errors.connectFailed],
  );

  const disconnect = useCallback(async () => {
    setError(null);
    await printerService.disconnect();
  }, []);

  const printTicket = useCallback(
    async (payload: TicketPayload) => {
      setIsPrinting(true);
      setError(null);

      try {
        await printerService.printTicket(payload);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : copy.errors.printFailed;
        setError(message);
        throw err;
      } finally {
        setIsPrinting(false);
      }
    },
    [copy.errors.printFailed],
  );

  const printCreditTicket = useCallback(
    async (payload: CreditTicketPayload) => {
      setIsPrinting(true);
      setError(null);

      try {
        await printerService.printCreditTicket(payload);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : copy.errors.printFailed;
        setError(message);
        throw err;
      } finally {
        setIsPrinting(false);
      }
    },
    [copy.errors.printFailed],
  );

  return {
    state,
    isConnecting,
    isPrinting,
    error,
    isSupported,
    connect,
    disconnect,
    printTicket,
    printCreditTicket,
    clearError: () => setError(null),
  };
}
