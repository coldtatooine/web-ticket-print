"use client";

import { FormEvent, useState } from "react";

import { LanguageSelector } from "@/components/LanguageSelector";
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
import { cn } from "@/lib/utils";

interface CreditAuthFormProps {
  notConfigured?: boolean;
}

export function CreditAuthForm({ notConfigured = false }: CreditAuthFormProps) {
  const copy = useCopy();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/credit/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const statusMessage =
          response.status === 503
            ? copy.credit.auth.notConfigured
            : response.status === 400
              ? copy.credit.auth.invalidRequest
              : response.status === 401
                ? copy.credit.auth.invalidPassword
                : copy.credit.auth.invalidPassword;
        setMessage(statusMessage);
        return;
      }

      window.location.reload();
    } catch {
      setMessage(copy.credit.auth.invalidPassword);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="fixed top-5 right-5 z-50">
        <LanguageSelector />
      </div>

      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{copy.credit.auth.title}</CardTitle>
          <CardDescription>
            {notConfigured
              ? copy.credit.auth.notConfigured
              : copy.credit.auth.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {notConfigured ? null : (
            <form
              onSubmit={(event) => void handleSubmit(event)}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="credit_password">
                  {copy.credit.auth.passwordLabel}
                </Label>
                <Input
                  id="credit_password"
                  name="credit_password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={copy.credit.auth.passwordPlaceholder}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? copy.credit.auth.submitting
                  : copy.credit.auth.submit}
              </Button>
            </form>
          )}

          {message ? (
            <p
              role="status"
              className={cn(
                "rounded-base border-2 px-4 py-3 text-center text-sm font-base",
                notConfigured
                  ? "mt-0 border-status-critical bg-status-critical-bg text-status-critical"
                  : "mt-4 border-status-critical bg-status-critical-bg text-status-critical",
              )}
            >
              {message}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
