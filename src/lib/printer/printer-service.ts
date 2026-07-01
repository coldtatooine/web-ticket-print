import type { PrinterConnectionType, PrinterDeviceInfo } from "@/types/printer";
import type { CreditTicketPayload } from "@/types/credit-ticket";
import type { TicketPayload } from "@/types/ticket";
import { getCopy } from "@/lib/i18n";
import { DEFAULT_LOCALE, type Copy } from "@/lib/i18n/types";

type PrinterDriver = {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  print(data: Uint8Array): Promise<void>;
  addEventListener(
    event: "connected" | "disconnected",
    callback: (detail: unknown) => void,
  ): void;
};

type ConnectedHandler = (device: PrinterDeviceInfo) => void;
type DisconnectedHandler = () => void;

// #region agent log
function debugLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string,
) {
  fetch("http://127.0.0.1:7770/ingest/83c26a9a-f936-4e91-96c1-b8d2a916f3b9", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "dfd277",
    },
    body: JSON.stringify({
      sessionId: "dfd277",
      location,
      message,
      data,
      hypothesisId,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

function isBrowserSupported(type: PrinterConnectionType): boolean {
  if (typeof navigator === "undefined") return false;

  switch (type) {
    case "usb":
      return "usb" in navigator;
    case "bluetooth":
      return "bluetooth" in navigator;
    case "serial":
      return "serial" in navigator;
    default:
      return false;
  }
}

function connectionLabel(type: PrinterConnectionType): string {
  switch (type) {
    case "usb":
      return "USB";
    case "bluetooth":
      return "Bluetooth";
    case "serial":
      return "Serial";
  }
}

async function createDriver(
  type: PrinterConnectionType,
): Promise<PrinterDriver> {
  switch (type) {
    case "usb": {
      const { default: WebUSBReceiptPrinter } = await import(
        "@point-of-sale/webusb-receipt-printer"
      );
      return new WebUSBReceiptPrinter();
    }
    case "bluetooth": {
      const { default: WebBluetoothReceiptPrinter } = await import(
        "@point-of-sale/webbluetooth-receipt-printer"
      );
      return new WebBluetoothReceiptPrinter();
    }
    case "serial": {
      const { default: WebSerialReceiptPrinter } = await import(
        "@point-of-sale/webserial-receipt-printer"
      );
      return new WebSerialReceiptPrinter();
    }
  }
}

function mapConnectedDevice(
  type: PrinterConnectionType,
  detail: unknown,
): PrinterDeviceInfo {
  const info = (detail ?? {}) as Record<string, unknown>;
  const name =
    (info.productName as string | undefined) ??
    (info.name as string | undefined) ??
    (info.manufacturerName as string | undefined) ??
    `Impressora ${connectionLabel(type)}`;

  return {
    type,
    name,
    language: info.language as string | undefined,
    codepageMapping: info.codepageMapping as string | undefined,
  };
}

class PrinterService {
  private driver: PrinterDriver | null = null;
  private connectionType: PrinterConnectionType | null = null;
  private device: PrinterDeviceInfo | null = null;
  private onConnected: ConnectedHandler | null = null;
  private onDisconnected: DisconnectedHandler | null = null;
  private isPrinting = false;
  private copy: Copy = getCopy(DEFAULT_LOCALE);

  setCopy(copy: Copy) {
    this.copy = copy;
  }

  setHandlers(
    onConnected: ConnectedHandler,
    onDisconnected: DisconnectedHandler,
  ) {
    this.onConnected = onConnected;
    this.onDisconnected = onDisconnected;
  }

  getState() {
    return {
      connected: this.device !== null,
      device: this.device,
      connectionType: this.connectionType,
    };
  }

  isSupported(type: PrinterConnectionType): boolean {
    return isBrowserSupported(type);
  }

  async connect(type: PrinterConnectionType): Promise<void> {
    if (!isBrowserSupported(type)) {
      throw new Error(this.copy.errors.unsupportedBrowser(type));
    }

    // #region agent log
    debugLog(
      "printer-service.ts:connect:start",
      "connect called",
      { type, hadDriver: this.driver !== null },
      "C",
    );
    // #endregion

    if (this.driver) {
      await this.disconnect();
    }

    const driver = await createDriver(type);
    this.connectionType = type;

    driver.addEventListener("connected", (detail) => {
      this.device = mapConnectedDevice(type, detail);
      // #region agent log
      debugLog(
        "printer-service.ts:connected",
        "driver connected event",
        {
          type,
          deviceName: this.device.name,
          visibilityState:
            typeof document !== "undefined"
              ? document.visibilityState
              : "unknown",
        },
        "A",
      );
      // #endregion
      this.onConnected?.(this.device);
    });

    driver.addEventListener("disconnected", () => {
      // #region agent log
      debugLog(
        "printer-service.ts:disconnected",
        "driver disconnected event",
        {
          type: this.connectionType,
          wasPrinting: this.isPrinting,
          visibilityState:
            typeof document !== "undefined"
              ? document.visibilityState
              : "unknown",
        },
        "A",
      );
      // #endregion
      this.device = null;
      this.connectionType = null;
      this.driver = null;
      this.onDisconnected?.();
    });

    this.driver = driver;
    await driver.connect();
  }

  async disconnect(): Promise<void> {
    // #region agent log
    debugLog(
      "printer-service.ts:disconnect",
      "explicit disconnect called",
      {
        type: this.connectionType,
        hadDriver: this.driver !== null,
        stack: new Error().stack?.split("\n").slice(1, 4).join(" | "),
      },
      "C",
    );
    // #endregion
    if (this.driver) {
      await this.driver.disconnect();
    }
    this.driver = null;
    this.device = null;
    this.connectionType = null;
  }

  async printTicket(payload: TicketPayload): Promise<void> {
    await this.printEncodedPayload(
      (await import("@/lib/format-ticket")).encodeTicket,
      payload,
    );
  }

  async printCreditTicket(payload: CreditTicketPayload): Promise<void> {
    await this.printEncodedPayload(
      (await import("@/lib/format-credit-ticket")).encodeCreditTicket,
      payload,
    );
  }

  private async printEncodedPayload<T>(
    encode: (
      payload: T,
      options: { language?: string; codepageMapping?: string },
    ) => Promise<Uint8Array>,
    payload: T,
  ): Promise<void> {
    if (!this.driver || !this.device) {
      throw new Error(this.copy.errors.notConnected);
    }

    const data = await encode(payload, {
      language: this.device.language,
      codepageMapping: this.device.codepageMapping,
    });

    // #region agent log
    debugLog(
      "printer-service.ts:print:before",
      "print starting",
      {
        type: this.connectionType,
        bytes: data.byteLength,
        visibilityState:
          typeof document !== "undefined" ? document.visibilityState : "unknown",
      },
      "B",
    );
    // #endregion

    this.isPrinting = true;
    try {
      await this.driver.print(data);
      // #region agent log
      debugLog(
        "printer-service.ts:print:after",
        "print finished",
        {
          type: this.connectionType,
          stillHasDriver: this.driver !== null,
          stillHasDevice: this.device !== null,
        },
        "B",
      );
      // #endregion
    } catch (err) {
      // #region agent log
      debugLog(
        "printer-service.ts:print:error",
        "print threw",
        {
          type: this.connectionType,
          error: err instanceof Error ? err.message : String(err),
        },
        "B",
      );
      // #endregion
      throw err;
    } finally {
      this.isPrinting = false;
    }
  }
}

export const printerService = new PrinterService();
