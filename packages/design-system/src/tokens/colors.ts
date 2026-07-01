import type { StatusColorPair } from "./types.js";

/** Tema escuro — Tela do Salão (seção 4.2). */
export const darkColors = {
  bg: "#0F0F0F",
  surface: "#1A1A1A",
  border: "#2E2E2E",
  text: "#F5F5F0",
  primary: "#FFD60A",
} as const;

/** Cores de status operacional — seção 4.1 e 4.3. */
export const statusColors = {
  waiting: { fg: "#FFD60A", bg: "#FFF8CC" },
  progress: { fg: "#1B6EF3", bg: "#E8F0FE" },
  alert: { fg: "#FF6B00", bg: "#FFF0E6" },
  critical: { fg: "#E11D1D", bg: "#FEECEC" },
  done: { fg: "#16A34A", bg: "#DCFCE7" },
  rejected: { fg: "#6B7280", bg: "#F3F4F6" },
} as const satisfies Record<string, StatusColorPair>;

/** Sombras coloridas por status na tela do salão — seção 9.4. */
export const salaoStatusShadowColors = {
  critical: "#E11D1D",
  alert: "#FF6B00",
  progress: "#1B6EF3",
  waiting: "#B8960A",
  done: "#16A34A",
} as const;

/** Paleta candy da landing page — decoração, não status operacional. */
export const lpColors = {
  yellow: "#FFD60A",
  green: "#22C55E",
  pink: "#FBCFE8",
  blue: "#DBEAFE",
  lavender: "#E9D5FF",
} as const;

/** Tokens de domínio Gogogo! (status + salão + LP). Cores base vêm do neobrutalism. */
export const colors = {
  dark: darkColors,
  status: statusColors,
  salaoStatusShadow: salaoStatusShadowColors,
  lp: lpColors,
} as const;

/** CSS custom properties de domínio (importadas via domain.css). */
export const colorCssVars = {
  "--gg-color-dark-bg": darkColors.bg,
  "--gg-color-dark-surface": darkColors.surface,
  "--gg-color-dark-border": darkColors.border,
  "--gg-color-dark-text": darkColors.text,
  "--gg-color-dark-primary": darkColors.primary,

  "--gg-color-status-waiting": statusColors.waiting.fg,
  "--gg-color-status-waiting-bg": statusColors.waiting.bg,
  "--gg-color-status-progress": statusColors.progress.fg,
  "--gg-color-status-progress-bg": statusColors.progress.bg,
  "--gg-color-status-alert": statusColors.alert.fg,
  "--gg-color-status-alert-bg": statusColors.alert.bg,
  "--gg-color-status-critical": statusColors.critical.fg,
  "--gg-color-status-critical-bg": statusColors.critical.bg,
  "--gg-color-status-done": statusColors.done.fg,
  "--gg-color-status-done-bg": statusColors.done.bg,
  "--gg-color-status-rejected": statusColors.rejected.fg,
  "--gg-color-status-rejected-bg": statusColors.rejected.bg,

  "--gg-color-salao-shadow-critical": salaoStatusShadowColors.critical,
  "--gg-color-salao-shadow-alert": salaoStatusShadowColors.alert,
  "--gg-color-salao-shadow-progress": salaoStatusShadowColors.progress,
  "--gg-color-salao-shadow-waiting": salaoStatusShadowColors.waiting,
  "--gg-color-salao-shadow-done": salaoStatusShadowColors.done,

  "--gg-lp-yellow": lpColors.yellow,
  "--gg-lp-green": lpColors.green,
  "--gg-lp-pink": lpColors.pink,
  "--gg-lp-blue": lpColors.blue,
  "--gg-lp-lavender": lpColors.lavender,
} as const;

export type LpAccentColor = keyof typeof lpColors;

export type StatusColor = keyof typeof statusColors;
