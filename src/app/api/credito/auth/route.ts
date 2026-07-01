import { NextResponse } from "next/server";

import {
  clearCreditModuleSessionCookie,
  isCreditModuleConfigured,
  setCreditModuleSessionCookie,
  verifyCreditModulePassword,
} from "@/lib/credit-auth";
import { COPY } from "@/lib/copy";

interface AuthRequestBody {
  password?: string;
}

export async function POST(request: Request) {
  if (!isCreditModuleConfigured()) {
    return NextResponse.json(
      { error: COPY.credit.auth.notConfigured },
      { status: 503 },
    );
  }

  let body: AuthRequestBody;

  try {
    body = (await request.json()) as AuthRequestBody;
  } catch {
    return NextResponse.json(
      { error: COPY.credit.auth.invalidRequest },
      { status: 400 },
    );
  }

  const password = body.password?.trim() ?? "";

  if (!password) {
    return NextResponse.json(
      { error: COPY.credit.auth.passwordRequired },
      { status: 400 },
    );
  }

  if (!verifyCreditModulePassword(password)) {
    return NextResponse.json(
      { error: COPY.credit.auth.invalidPassword },
      { status: 401 },
    );
  }

  await setCreditModuleSessionCookie();

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearCreditModuleSessionCookie();
  return NextResponse.json({ ok: true });
}
