"use client";

import { useRef } from "react";

import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { LOCALE_LABELS, LOCALES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { locale, copy, setLocale } = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const current = LOCALE_LABELS[locale];

  return (
    <>
      <Button
        type="button"
        variant="neutral"
        size="icon"
        className="rounded-full text-base"
        onClick={open}
        aria-label={copy.locale.label}
        title={copy.locale.label}
      >
        <span aria-hidden>{current.flag}</span>
      </Button>

      <dialog
        ref={dialogRef}
        aria-label={copy.locale.label}
        className="fixed inset-0 z-50 m-auto max-h-[85vh] w-[calc(100%-2.5rem)] max-w-xs overflow-hidden rounded-base border-2 border-border bg-background p-0 shadow-shadow open:flex open:flex-col backdrop:bg-overlay"
        onCancel={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            close();
          }
        }}
      >
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-heading text-sm">{copy.locale.label}</p>
            <Button type="button" variant="noShadow" size="sm" onClick={close}>
              {copy.app.helpClose}
            </Button>
          </div>
          <ul className="space-y-1">
            {LOCALES.map((code) => {
              const { flag, labelKey } = LOCALE_LABELS[code];
              const label = copy.locale[labelKey];
              const selected = code === locale;

              return (
                <li key={code}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-base border-2 px-3 py-2 text-left text-sm transition-colors",
                      selected
                        ? "border-main bg-secondary-background font-heading"
                        : "border-transparent hover:border-border hover:bg-secondary-background/60",
                    )}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => {
                      setLocale(code);
                      close();
                    }}
                  >
                    <span aria-hidden className="text-lg">
                      {flag}
                    </span>
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </>
  );
}
