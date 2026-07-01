"use client";

import dynamic from "next/dynamic";

import { useCopy } from "@/contexts/LocaleContext";

const TicketApp = dynamic(
  () => import("@/components/TicketApp").then((module) => module.TicketApp),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  },
);

function LoadingScreen() {
  const copy = useCopy();
  return (
    <div className="flex min-h-screen items-center justify-center page-hero-bg">
      <p className="font-heading text-lg">{copy.app.loading}</p>
    </div>
  );
}

export function ClientTicketApp() {
  return <TicketApp />;
}
