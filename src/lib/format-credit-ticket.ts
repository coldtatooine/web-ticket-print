import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";

import {
  BRAND_LOGO_IMAGE_MODE,
  PAPER_COLUMNS,
} from "@/lib/constants";
import {
  getBrandLogoDimensions,
  loadBrandLogo,
} from "@/lib/load-brand-image";
import {
  resolveEncoderOptions,
  type EncoderDeviceOptions,
} from "@/lib/printer/encoder-options";
import type { CreditTicketPayload } from "@/types/credit-ticket";

export type EncodeCreditTicketOptions = EncoderDeviceOptions;

const GIFT_HEADLINE = "Um presente pra você!";

function wrapText(text: string, columns: number): string[] {
  const normalized = text.trim();
  if (!normalized) return [];

  const lines: string[] = [];
  let remaining = normalized;

  while (remaining.length > columns) {
    lines.push(remaining.slice(0, columns));
    remaining = remaining.slice(columns);
  }

  if (remaining) {
    lines.push(remaining);
  }

  return lines;
}

export async function encodeCreditTicket(
  { eventName, creditLink }: CreditTicketPayload,
  options: EncodeCreditTicketOptions = {},
): Promise<Uint8Array> {
  const displayEventName = eventName.trim();
  const link = creditLink.trim();
  const { language, codepageMapping } = resolveEncoderOptions(options);
  const logo = await loadBrandLogo();
  const { width, height, dither } = getBrandLogoDimensions();

  const encoder = new ReceiptPrinterEncoder({
    language,
    codepageMapping,
    columns: PAPER_COLUMNS,
    feedBeforeCut: 2,
    imageMode: BRAND_LOGO_IMAGE_MODE,
  });

  let chain = encoder.initialize().align("center");

  if (logo) {
    chain = chain.image(logo, width, height, dither).newline();
  }

  chain = chain
    .bold(true)
    .line(GIFT_HEADLINE)
    .bold(false)
    .newline()
    .bold(true)
    .line(displayEventName)
    .bold(false)
    .newline()
    .qrcode(link, { model: 2, size: 5, errorlevel: "m" })
    .newline();

  for (const line of wrapText(link, PAPER_COLUMNS)) {
    chain = chain.line(line);
  }

  return chain.cut().encode();
}
