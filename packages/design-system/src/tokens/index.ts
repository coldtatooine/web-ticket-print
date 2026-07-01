import { colors, colorCssVars } from "./colors.js";
import { typography, typographyCssVars } from "./typography.js";
import { zIndex, zIndexCssVars } from "./z-index.js";

export { colorCssVars } from "./colors.js";
export { typographyCssVars } from "./typography.js";
export { zIndexCssVars } from "./z-index.js";

export * from "./colors.js";
export * from "./typography.js";
export * from "./z-index.js";
export * from "./types.js";

/** Variáveis CSS de domínio Gogogo! (status, salão, tipografia). */
export const domainCssVars = {
  ...colorCssVars,
  ...typographyCssVars,
  ...zIndexCssVars,
} as const;

export type DomainCssVarName = keyof typeof domainCssVars;

/** Tokens de domínio para uso programático. */
export const tokens = {
  colors,
  typography,
  zIndex,
} as const;
