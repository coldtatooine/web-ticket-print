import * as XLSX from "xlsx";

import type { ImportedCreditTicket } from "@/types/credit-import";

const LINK_HEADERS = ["link", "url", "credit_link", "link_credito", "credito", "href"];
const EVENT_HEADERS = ["evento", "event", "event_name", "nome_evento", "nome do evento"];

export interface ParsedImportRow {
  url: string;
  eventName?: string;
}

export interface ImportParseResult {
  rows: ParsedImportRow[];
  skipped: number;
}

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function findColumnIndex(headers: string[], candidates: string[]): number {
  return headers.findIndex((header) => candidates.includes(header));
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getEffectiveColumnCount(matrix: unknown[][]): number {
  let maxColumns = 0;

  for (const row of matrix) {
    for (let index = row.length - 1; index >= 0; index -= 1) {
      if (String(row[index] ?? "").trim()) {
        maxColumns = Math.max(maxColumns, index + 1);
        break;
      }
    }
  }

  return maxColumns;
}

function firstCellValue(matrix: unknown[][]): string {
  return String(matrix[0]?.[0] ?? "").trim();
}

function isSingleColumnUrlList(matrix: unknown[][]): boolean {
  if (getEffectiveColumnCount(matrix) !== 1) {
    return false;
  }

  let nonEmptyRows = 0;
  let urlRows = 0;

  for (const row of matrix) {
    const value = String(row[0] ?? "").trim();
    if (!value) {
      continue;
    }

    nonEmptyRows += 1;
    if (isValidUrl(value)) {
      urlRows += 1;
    }
  }

  return nonEmptyRows > 0 && urlRows === nonEmptyRows;
}

function shouldSkipHeaderDetection(matrix: unknown[][]): boolean {
  if (matrix.length === 0) {
    return false;
  }

  if (getEffectiveColumnCount(matrix) === 1 && isSingleColumnUrlList(matrix)) {
    return true;
  }

  return isValidUrl(firstCellValue(matrix));
}

function rowsFromMatrix(matrix: unknown[][]): ImportParseResult {
  if (matrix.length === 0) {
    return { rows: [], skipped: 0 };
  }

  const firstRow = matrix[0]?.map(normalizeHeader) ?? [];
  const linkIndex = findColumnIndex(firstRow, LINK_HEADERS);
  const eventIndex = findColumnIndex(firstRow, EVENT_HEADERS);
  const hasHeader =
    !shouldSkipHeaderDetection(matrix) && (linkIndex >= 0 || eventIndex >= 0);
  const dataRows = hasHeader ? matrix.slice(1) : matrix;

  const resolvedLinkIndex = linkIndex >= 0 ? linkIndex : 0;
  const resolvedEventIndex =
    eventIndex >= 0 ? eventIndex : linkIndex >= 0 ? -1 : firstRow.length > 1 ? 1 : -1;

  const rows: ParsedImportRow[] = [];
  let skipped = 0;

  for (const row of dataRows) {
    const url = String(row[resolvedLinkIndex] ?? "").trim();
    if (!url || !isValidUrl(url)) {
      skipped += 1;
      continue;
    }

    const eventName =
      resolvedEventIndex >= 0
        ? String(row[resolvedEventIndex] ?? "").trim() || undefined
        : undefined;

    rows.push({ url, eventName });
  }

  return { rows, skipped };
}

export function parseSpreadsheetBuffer(buffer: ArrayBuffer): ImportParseResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return { rows: [], skipped: 0 };
  }

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  return rowsFromMatrix(matrix);
}

export function parseCsvText(text: string): ImportParseResult {
  const workbook = XLSX.read(text, { type: "string" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return { rows: [], skipped: 0 };
  }

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  return rowsFromMatrix(matrix);
}

export function toImportedTickets(rows: ParsedImportRow[]): ImportedCreditTicket[] {
  const now = new Date().toISOString();

  return rows.map((row) => ({
    id: crypto.randomUUID(),
    url: row.url.trim(),
    eventName: row.eventName,
    printed: false,
    importedAt: now,
  }));
}

export async function parseTicketLinksFile(file: File): Promise<ImportParseResult> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    const text = await file.text();
    return parseCsvText(text);
  }

  const buffer = await file.arrayBuffer();
  return parseSpreadsheetBuffer(buffer);
}
