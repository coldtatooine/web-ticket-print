/** Tipografia — seções 3.1–3.4 do Design System. */
export const fontFamily = {
  display: "'Space Grotesk', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  fallback: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
} as const;

/** Escala de tamanhos — seção 3.2. */
export const fontSize = {
  "2xs": "0.625rem",
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  display: "4.5rem",
} as const;

/** Pesos tipográficos — seção 3.3. */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/** Line heights — seção 3.4. */
export const lineHeight = {
  display: 1.2,
  body: 1.5,
} as const;

/** Letter spacing — seção 3.4. */
export const letterSpacing = {
  headingTight: "-0.02em",
  labelWide: "0.04em",
  badgeWide: "0.05em",
} as const;

/** Comprimento máximo de linha de corpo. */
export const measure = {
  bodyMax: "65ch",
} as const;

/** Tokens específicos da Tela do Salão — seção 9.3. */
export const salaoTypography = {
  status: "3rem",
  ordem: "2.25rem",
  descricao: "1.5rem",
  tecnico: "1.25rem",
  timer: "1.75rem",
} as const;

/** Tamanhos de fonte para botões — seção 6.1. */
export const buttonFontSize = {
  sm: "0.8125rem",
  md: "0.875rem",
  lg: "1rem",
  xl: "1.125rem",
} as const;

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  measure,
  salao: salaoTypography,
  button: buttonFontSize,
} as const;

export const typographyCssVars = {
  "--gg-font-display": fontFamily.display,
  "--gg-font-body": fontFamily.body,
  "--gg-font-fallback": fontFamily.fallback,

  "--gg-font-size-2xs": fontSize["2xs"],
  "--gg-font-size-xs": fontSize.xs,
  "--gg-font-size-sm": fontSize.sm,
  "--gg-font-size-base": fontSize.base,
  "--gg-font-size-lg": fontSize.lg,
  "--gg-font-size-xl": fontSize.xl,
  "--gg-font-size-2xl": fontSize["2xl"],
  "--gg-font-size-3xl": fontSize["3xl"],
  "--gg-font-size-4xl": fontSize["4xl"],
  "--gg-font-size-5xl": fontSize["5xl"],
  "--gg-font-size-display": fontSize.display,

  "--gg-font-weight-regular": String(fontWeight.regular),
  "--gg-font-weight-medium": String(fontWeight.medium),
  "--gg-font-weight-semibold": String(fontWeight.semibold),
  "--gg-font-weight-bold": String(fontWeight.bold),
  "--gg-font-weight-extrabold": String(fontWeight.extrabold),

  "--gg-line-height-display": String(lineHeight.display),
  "--gg-line-height-body": String(lineHeight.body),

  "--gg-letter-spacing-heading-tight": letterSpacing.headingTight,
  "--gg-letter-spacing-label-wide": letterSpacing.labelWide,
  "--gg-letter-spacing-badge-wide": letterSpacing.badgeWide,

  "--gg-measure-body-max": measure.bodyMax,

  "--gg-font-size-salao-status": salaoTypography.status,
  "--gg-font-size-salao-ordem": salaoTypography.ordem,
  "--gg-font-size-salao-descricao": salaoTypography.descricao,
  "--gg-font-size-salao-tecnico": salaoTypography.tecnico,
  "--gg-font-size-salao-timer": salaoTypography.timer,
} as const;
