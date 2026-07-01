import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";

import {
  BRAND_LOGO_IMAGE_MODE,
  PAPER_COLUMNS,
  TICKET_DIVIDER,
} from "@/lib/constants";
import {
  getBrandLogoDimensions,
  loadBrandLogo,
} from "@/lib/load-brand-image";
import {
  resolveEncoderOptions,
  type EncoderDeviceOptions,
} from "@/lib/printer/encoder-options";
import type { TicketPayload } from "@/types/ticket";

export type EncodeTicketOptions = EncoderDeviceOptions;

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function encodeTicket(
  { fromName, question }: TicketPayload,
  options: EncodeTicketOptions = {},
): Promise<Uint8Array> {
  const now = new Date();
  const displayName = fromName.trim() || "Anonymous";
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

  return chain
    .align("left")
    .bold(true)
    .line(`From: ${displayName}`)
    .bold(false)
    .line(`Time: ${formatTime(now)}`)
    .line(`Date: ${formatDate(now)}`)
    .line(TICKET_DIVIDER)
    .bold(true)
    .line("Question/Comment")
    .bold(false)
    .text(question.trim())
    .newline()
    .cut()
    .encode();
}
