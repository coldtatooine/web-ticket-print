/** Valor primitivo de token — string ou número em px/ms. */
export type TokenValue = string | number;

/** Mapa genérico de tokens para uso programático. */
export type TokenRecord = Record<string, TokenValue>;

/** Par foreground/background para tokens de status. */
export type StatusColorPair = {
  readonly fg: string;
  readonly bg: string;
};
