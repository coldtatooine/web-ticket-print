/** Mapeamentos válidos no ReceiptPrinterEncoder v3 (esc-pos). */
const VALID_ESC_POS_MAPPINGS = new Set([
  "bixolon/legacy",
  "bixolon",
  "citizen",
  "epson/legacy",
  "epson",
  "fujitsu",
  "hp",
  "metapace",
  "mpt",
  "pos-5890",
  "pos-8360",
  "star",
  "xprinter",
  "youku",
  "zijang",
]);

/** Aliases retornados pelas libs web*-receipt-printer. */
const CODEPAGE_ALIASES: Record<string, string> = {
  // typo nas libs @point-of-sale (webusb/webbluetooth)
  zjiang: "zijang",
  // fallback genérico de impressoras 58mm
  default: "pos-5890",
};

const DEFAULT_ESC_POS_MAPPING = "pos-5890";
const DEFAULT_STAR_MAPPING = "star";

export interface EncoderDeviceOptions {
  language?: string | null;
  codepageMapping?: string | null;
}

export interface ResolvedEncoderOptions {
  language: string;
  codepageMapping: string;
}

function isValidEscPosMapping(mapping: string): boolean {
  return VALID_ESC_POS_MAPPINGS.has(mapping);
}

function normalizeLanguage(language?: string | null): string {
  if (language === "star-prnt" || language === "star-line") {
    return language;
  }

  return "esc-pos";
}

function normalizeCodepageMapping(
  language: string,
  mapping?: string | null,
): string {
  const trimmed = mapping?.trim();

  if (trimmed) {
    const resolved = CODEPAGE_ALIASES[trimmed] ?? trimmed;

    if (language === "esc-pos" && isValidEscPosMapping(resolved)) {
      return resolved;
    }

    if (
      (language === "star-prnt" || language === "star-line") &&
      resolved === "star"
    ) {
      return resolved;
    }
  }

  return language === "esc-pos"
    ? DEFAULT_ESC_POS_MAPPING
    : DEFAULT_STAR_MAPPING;
}

/** Normaliza language/codepage vindos do driver antes do ReceiptPrinterEncoder. */
export function resolveEncoderOptions(
  device: EncoderDeviceOptions = {},
): ResolvedEncoderOptions {
  const language = normalizeLanguage(device.language);
  const codepageMapping = normalizeCodepageMapping(
    language,
    device.codepageMapping,
  );

  return { language, codepageMapping };
}
