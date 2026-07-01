import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";
import { ptBRCopy } from "@/lib/i18n/locales/pt-BR";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: ptBRCopy.meta.title,
  description: ptBRCopy.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn("h-full antialiased", spaceGrotesk.variable, inter.variable)}
      style={
        {
          "--gg-font-display":
            "var(--font-space-grotesk), system-ui, sans-serif",
          "--gg-font-body": "var(--font-inter), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col page-hero-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
