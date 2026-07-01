"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopy } from "@/contexts/LocaleContext";
import {
  MAX_CREDIT_LINK_LENGTH,
  MAX_EVENT_NAME_LENGTH,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { validateCreditTicket } from "@/lib/validate-credit-ticket";
import type { CreditEventEntry } from "@/types/credit-import";
import type { CreditTicketPayload } from "@/types/credit-ticket";

const NEW_EVENT_VALUE = "__new__";

export interface CreditTicketFormValues {
  eventName: string;
  creditLink: string;
}

interface CreditTicketFormProps {
  connected: boolean;
  isPrinting: boolean;
  events: CreditEventEntry[];
  initialValues: CreditTicketFormValues;
  ticketId: string | null;
  onSubmit: (payload: CreditTicketPayload) => Promise<void>;
  onPrinted?: (ticketId: string | null, payload: CreditTicketPayload) => void;
  onRegisterEvent: (name: string) => void;
}

type MessageType = "success" | "error" | null;

export function CreditTicketForm({
  connected,
  isPrinting,
  events,
  initialValues,
  ticketId,
  onSubmit,
  onPrinted,
  onRegisterEvent,
}: CreditTicketFormProps) {
  const copy = useCopy();
  const [eventName, setEventName] = useState(initialValues.eventName);
  const [creditLink, setCreditLink] = useState(initialValues.creditLink);
  const [selectedEventId, setSelectedEventId] = useState(() => {
    if (!initialValues.eventName) {
      return NEW_EVENT_VALUE;
    }

    const matchedEvent = events.find(
      (event) =>
        event.name.toLocaleLowerCase("pt-BR") ===
        initialValues.eventName.toLocaleLowerCase("pt-BR"),
    );

    return matchedEvent?.id ?? NEW_EVENT_VALUE;
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>(null);

  function showMessage(text: string, type: Exclude<MessageType, null>) {
    setMessage(text);
    setMessageType(type);

    if (type === "success") {
      window.setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    }
  }

  function handleEventSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    setSelectedEventId(value);

    if (value === NEW_EVENT_VALUE) {
      return;
    }

    const selected = events.find((entry) => entry.id === value);
    if (selected) {
      setEventName(selected.name);
    }
  }

  function handleEventNameChange(value: string) {
    setEventName(value);
    setSelectedEventId(NEW_EVENT_VALUE);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: CreditTicketPayload = { eventName, creditLink };
    const validation = validateCreditTicket(payload, copy);

    if (!validation.valid) {
      showMessage(validation.error ?? copy.credit.validation.invalid, "error");
      return;
    }

    if (!connected) {
      showMessage(copy.credit.form.notConnected, "error");
      return;
    }

    try {
      await onSubmit(payload);
      onRegisterEvent(eventName.trim());
      onPrinted?.(ticketId, payload);
      showMessage(copy.credit.form.success, "success");
      setEventName("");
      setCreditLink("");
      setSelectedEventId(NEW_EVENT_VALUE);
    } catch {
      showMessage(copy.credit.form.printFailed, "error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.credit.form.title}</CardTitle>
        <CardDescription>{copy.credit.form.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
          {events.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="event_select">{copy.credit.events.selectLabel}</Label>
              <select
                id="event_select"
                value={selectedEventId}
                onChange={handleEventSelect}
                className={cn(
                  "flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground",
                  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                )}
              >
                <option value="">{copy.credit.events.selectPlaceholder}</option>
                {events.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
                <option value={NEW_EVENT_VALUE}>{copy.credit.events.addNew}</option>
              </select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="event_name">{copy.credit.form.eventNameLabel}</Label>
            <Input
              id="event_name"
              name="event_name"
              type="text"
              maxLength={MAX_EVENT_NAME_LENGTH}
              value={eventName}
              onChange={(event) => handleEventNameChange(event.target.value)}
              placeholder={copy.credit.form.eventNamePlaceholder}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credit_link">{copy.credit.form.creditLinkLabel}</Label>
            <Input
              id="credit_link"
              name="credit_link"
              type="url"
              inputMode="url"
              maxLength={MAX_CREDIT_LINK_LENGTH}
              value={creditLink}
              onChange={(event) => setCreditLink(event.target.value)}
              placeholder={copy.credit.form.creditLinkPlaceholder}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPrinting || !connected}
          >
            {isPrinting ? copy.credit.form.submitting : copy.credit.form.submit}
          </Button>
        </form>

        {message ? (
          <p
            role="status"
            className={cn(
              "mt-4 rounded-base border-2 px-4 py-3 text-center text-sm font-base",
              messageType === "success"
                ? "border-status-done bg-status-done-bg text-status-done"
                : "border-status-critical bg-status-critical-bg text-status-critical",
            )}
          >
            {message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
