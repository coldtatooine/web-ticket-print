import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "credit_module_session";
const SESSION_SCOPE = "credit-module-v1";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getConfiguredPassword(): string | null {
  const password = process.env.CREDIT_MODULE_PASSWORD?.trim();
  return password ? password : null;
}

function getExpectedSessionToken(): string | null {
  const password = getConfiguredPassword();
  if (!password) return null;

  return createHmac("sha256", password).update(SESSION_SCOPE).digest("hex");
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isCreditModuleConfigured(): boolean {
  return getConfiguredPassword() !== null;
}

export function verifyCreditModulePassword(password: string): boolean {
  const configured = getConfiguredPassword();
  if (!configured) return false;

  return safeCompare(password, configured);
}

export async function isCreditModuleAuthenticated(): Promise<boolean> {
  const expected = getExpectedSessionToken();
  if (!expected) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return false;

  return safeCompare(session, expected);
}

export async function setCreditModuleSessionCookie(): Promise<void> {
  const token = getExpectedSessionToken();
  if (!token) {
    throw new Error("CREDIT_MODULE_PASSWORD is not configured");
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearCreditModuleSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
