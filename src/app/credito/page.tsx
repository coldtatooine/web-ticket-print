import type { Metadata } from "next";

import { CreditAuthForm } from "@/components/CreditAuthForm";
import { ClientCreditTicketApp } from "@/components/ClientCreditTicketApp";
import {
  isCreditModuleAuthenticated,
  isCreditModuleConfigured,
} from "@/lib/credit-auth";
import { ptBRCopy } from "@/lib/i18n/locales/pt-BR";

export const metadata: Metadata = {
  title: ptBRCopy.credit.meta.title,
  description: ptBRCopy.credit.meta.description,
};

export const dynamic = "force-dynamic";

export default async function CreditoPage() {
  const configured = isCreditModuleConfigured();

  if (!configured) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-10">
        <CreditAuthForm notConfigured />
      </main>
    );
  }

  const authenticated = await isCreditModuleAuthenticated();

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-10">
        <CreditAuthForm />
      </main>
    );
  }

  return (
    <main>
      <ClientCreditTicketApp />
    </main>
  );
}
