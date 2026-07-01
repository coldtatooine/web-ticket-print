"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCopy } from "@/contexts/LocaleContext";

export function RequirementsHelp() {
  const copy = useCopy();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button
        type="button"
        variant="neutral"
        size="icon"
        className="rounded-full font-heading text-lg"
        onClick={open}
        aria-label={copy.app.helpButtonLabel}
      >
        ?
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="requirements-help-title"
        className="fixed inset-0 z-50 m-auto max-h-[85vh] w-[calc(100%-2.5rem)] max-w-md overflow-hidden rounded-base border-2 border-border bg-background p-0 shadow-shadow open:flex open:flex-col backdrop:bg-overlay"
        onCancel={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            close();
          }
        }}
      >
        <Card className="max-h-[85vh] overflow-y-auto border-0 shadow-none">
          <CardContent className="text-xs text-foreground/80">
            <div className="flex items-start justify-between gap-3">
              <p
                id="requirements-help-title"
                className="font-heading text-sm"
              >
                {copy.app.requirementsTitle}
              </p>
              <Button
                type="button"
                variant="noShadow"
                size="sm"
                className="shrink-0"
                onClick={close}
              >
                {copy.app.helpClose}
              </Button>
            </div>
            <ul className="mt-2 list-inside list-disc space-y-1 font-base">
              {copy.app.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </dialog>
    </>
  );
}
