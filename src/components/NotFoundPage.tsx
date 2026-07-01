"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCopy } from "@/contexts/LocaleContext";

export function NotFoundPage() {
  const copy = useCopy();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 py-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="font-heading text-6xl font-bold tracking-tight sm:text-7xl">
          404
        </p>
        <h1 className="font-heading text-xl font-semibold sm:text-2xl">
          {copy.notFound.title}
        </h1>
        <p className="max-w-sm text-sm text-foreground/70">
          {copy.notFound.description}
        </p>
      </div>

      <div className="relative size-48 shrink-0 overflow-hidden rounded-full border-2 border-border shadow-shadow sm:size-56">
        <Image
          src="/capivara.gif"
          alt={copy.notFound.imageAlt}
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </div>

      <Button asChild size="lg">
        <Link href="/">{copy.notFound.homeLink}</Link>
      </Button>
    </main>
  );
}
