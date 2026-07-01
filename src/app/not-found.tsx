import type { Metadata } from "next";

import { NotFoundPage } from "@/components/NotFoundPage";
import { ptBRCopy } from "@/lib/i18n/locales/pt-BR";

export const metadata: Metadata = {
  title: ptBRCopy.notFound.meta.title,
};

export default function NotFound() {
  return <NotFoundPage />;
}
