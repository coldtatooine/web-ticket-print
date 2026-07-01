"use client";

import { FormEvent, useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { useCopy } from "@/contexts/LocaleContext";
import { MAX_QUESTION_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { validateTicket } from "@/lib/validate-ticket";
import type { TicketPayload } from "@/types/ticket";

interface TicketFormProps {
  connected: boolean;
  isPrinting: boolean;
  onSubmit: (payload: TicketPayload) => Promise<void>;
}

type MessageType = "success" | "error" | null;

export function TicketForm({ connected, isPrinting, onSubmit }: TicketFormProps) {
  const copy = useCopy();
  const [fromName, setFromName] = useState("");
  const [question, setQuestion] = useState("");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: TicketPayload = { fromName, question };
    const validation = validateTicket(payload, copy);

    if (!validation.valid) {
      showMessage(validation.error ?? copy.validation.invalid, "error");
      return;
    }

    if (!connected) {
      showMessage(copy.form.notConnected, "error");
      return;
    }

    try {
      await onSubmit(payload);
      showMessage(copy.form.success, "success");
      setFromName("");
      setQuestion("");
    } catch {
      showMessage(copy.form.printFailed, "error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.form.title}</CardTitle>
        <CardDescription>{copy.form.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="from_name">{copy.form.nameLabel}</Label>
            <Input
              id="from_name"
              name="from_name"
              type="text"
              autoComplete="name"
              maxLength={100}
              value={fromName}
              onChange={(event) => setFromName(event.target.value)}
              placeholder={copy.form.namePlaceholder}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">{copy.form.questionLabel}</Label>
            <Textarea
              id="question"
              name="question"
              maxLength={MAX_QUESTION_LENGTH}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={copy.form.questionPlaceholder}
              required
            />
            <p className="text-right text-sm text-foreground/70">
              {question.length}/{MAX_QUESTION_LENGTH}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPrinting || !connected}
          >
            {isPrinting ? copy.form.submitting : copy.form.submit}
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
