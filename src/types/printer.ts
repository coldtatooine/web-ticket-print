export type PrinterConnectionType = "usb" | "bluetooth" | "serial";

export interface PrinterDeviceInfo {
  type: PrinterConnectionType;
  name: string;
  language?: string;
  codepageMapping?: string;
}

export interface PrinterState {
  connected: boolean;
  device: PrinterDeviceInfo | null;
  connectionType: PrinterConnectionType | null;
}
