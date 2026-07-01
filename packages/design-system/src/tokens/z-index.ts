/** Camadas z-index para overlays e navegação. */
export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  toast: 1070,
  tooltip: 1080,
  salaoBroadcast: 100,
} as const;

export const zIndexCssVars = {
  "--gg-z-base": String(zIndex.base),
  "--gg-z-raised": String(zIndex.raised),
  "--gg-z-dropdown": String(zIndex.dropdown),
  "--gg-z-sticky": String(zIndex.sticky),
  "--gg-z-fixed": String(zIndex.fixed),
  "--gg-z-modal-backdrop": String(zIndex.modalBackdrop),
  "--gg-z-modal": String(zIndex.modal),
  "--gg-z-popover": String(zIndex.popover),
  "--gg-z-toast": String(zIndex.toast),
  "--gg-z-tooltip": String(zIndex.tooltip),
  "--gg-z-salao-broadcast": String(zIndex.salaoBroadcast),
} as const;
