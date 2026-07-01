/** Largura em colunas para papel 57/58mm (~32 caracteres). */
export const PAPER_COLUMNS = 32;

/** Divisor horizontal (32 cols — papel 57/58mm). */
export const TICKET_DIVIDER = "--------------------------------";

/** IDs USB padrão da Netum 58mm (ticket-printer-os). */
export const DEFAULT_USB_VENDOR_ID = 0x0416;
export const DEFAULT_USB_PRODUCT_ID = 0x5011;

export const MAX_NAME_LENGTH = 100;
export const MAX_QUESTION_LENGTH = 1000;

export const MAX_EVENT_NAME_LENGTH = 80;
export const MAX_CREDIT_LINK_LENGTH = 500;

/** Logo Cursor no header da aplicação (SVG em /public). */
export const APP_HEADER_LOGO_PATH = "/logo-512h.svg";

/** Logo no topo do ticket (PNG em /public). */
export const BRAND_LOGO_PATH = "/cursor-57mm-printer.png";

/** Largura/altura em pixels — devem ser múltiplos de 8 (papel 57/58mm). */
export const BRAND_LOGO_WIDTH = 256;
export const BRAND_LOGO_HEIGHT = 64;

/** Modo ESC/POS para imagens — impressoras 58mm baratas usam raster. */
export const BRAND_LOGO_IMAGE_MODE = "raster" as const;

/** Algoritmo de dithering para o logo. */
export const BRAND_LOGO_DITHER = "atkinson" as const;
