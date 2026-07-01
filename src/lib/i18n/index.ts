import { enUSCopy } from "@/lib/i18n/locales/en-US";
import { esMXCopy } from "@/lib/i18n/locales/es-MX";
import { ptBRCopy } from "@/lib/i18n/locales/pt-BR";
import { zhCNCopy } from "@/lib/i18n/locales/zh-CN";
import type { Copy, Locale } from "@/lib/i18n/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/types";

export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALES } from "@/lib/i18n/types";
export type { Copy, Locale } from "@/lib/i18n/types";

const COPIES: Record<Locale, Copy> = {
  "pt-BR": ptBRCopy,
  "es-MX": esMXCopy,
  "zh-CN": zhCNCopy,
  "en-US": enUSCopy,
};

export function getCopy(locale: Locale): Copy {
  return COPIES[locale] ?? COPIES[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return value in COPIES;
}

export function resolveLocale(stored: string | null | undefined): Locale {
  if (stored && isLocale(stored)) {
    return stored;
  }

  return DEFAULT_LOCALE;
}

export const LOCALE_LABELS: Record<
  Locale,
  { flag: string; labelKey: keyof Copy["locale"] }
> = {
  "pt-BR": { flag: "🇧🇷", labelKey: "ptBR" },
  "es-MX": { flag: "🇲🇽", labelKey: "esMX" },
  "zh-CN": { flag: "🇨🇳", labelKey: "zhCN" },
  "en-US": { flag: "🇺🇸", labelKey: "enUS" },
};
