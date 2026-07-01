declare module "@point-of-sale/receipt-printer-encoder" {
  interface EncoderOptions {
    language?: string;
    codepageMapping?: string;
    columns?: number;
    feedBeforeCut?: number;
    imageMode?: "raster" | "column";
  }

  export default class ReceiptPrinterEncoder {
    constructor(options?: EncoderOptions);
    initialize(): this;
    align(value: "left" | "center" | "right"): this;
    bold(value?: boolean): this;
    width(value: number): this;
    height(value: number): this;
    line(text: string): this;
    text(text: string): this;
    newline(count?: number): this;
    image(
      element: HTMLImageElement,
      width: number,
      height: number,
      algorithm?: "threshold" | "bayer" | "floydsteinberg" | "atkinson",
    ): this;
    qrcode(
      value: string,
      options?: {
        model?: 1 | 2;
        size?: number;
        errorlevel?: "l" | "m" | "q" | "h";
      },
    ): this;
    cut(type?: "partial" | "full"): this;
    encode(): Uint8Array;
  }
}

declare module "@point-of-sale/webusb-receipt-printer" {
  interface ConnectedEventDetail {
    type: string;
    productName?: string;
    manufacturerName?: string;
    language?: string;
    codepageMapping?: string;
  }

  export default class WebUSBReceiptPrinter {
    connect(): Promise<void>;
    reconnect(device: unknown): Promise<void>;
    disconnect(): Promise<void>;
    print(data: Uint8Array): Promise<void>;
    addEventListener(
      event: "connected" | "disconnected",
      callback: (detail: ConnectedEventDetail) => void,
    ): void;
  }
}

declare module "@point-of-sale/webbluetooth-receipt-printer" {
  interface ConnectedEventDetail {
    type: string;
    name?: string;
    language?: string;
    codepageMapping?: string;
  }

  export default class WebBluetoothReceiptPrinter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    print(data: Uint8Array): Promise<void>;
    addEventListener(
      event: "connected" | "disconnected",
      callback: (detail: ConnectedEventDetail) => void,
    ): void;
  }
}

declare module "@point-of-sale/webserial-receipt-printer" {
  interface ConnectedEventDetail {
    type: string;
    name?: string;
    language?: string;
    codepageMapping?: string;
  }

  export default class WebSerialReceiptPrinter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    print(data: Uint8Array): Promise<void>;
    addEventListener(
      event: "connected" | "disconnected",
      callback: (detail: ConnectedEventDetail) => void,
    ): void;
  }
}
