import type { PrinterConnectionType } from "@/types/printer";

export const LOCALES = ["pt-BR", "es-MX", "zh-CN", "en-US"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";

export const LOCALE_STORAGE_KEY = "web-ticket-print-locale";

export interface Copy {
  locale: {
    label: string;
    ptBR: string;
    esMX: string;
    zhCN: string;
    enUS: string;
  };
  app: {
    title: string;
    subtitle: string;
    requirementsTitle: string;
    requirements: readonly string[];
    dismissError: string;
    helpButtonLabel: string;
    helpClose: string;
    loading: string;
  };
  printer: {
    title: string;
    settingsButtonLabelConnected: string;
    settingsButtonLabelDisconnected: string;
    description: string;
    connectedPrefix: string;
    disconnect: string;
    connecting: string;
    connections: readonly {
      type: PrinterConnectionType;
      label: string;
      hint: string;
    }[];
  };
  form: {
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    questionLabel: string;
    questionPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    notConnected: string;
    printFailed: string;
  };
  validation: {
    nameRequired: string;
    nameTooLong: string;
    questionRequired: string;
    questionTooLong: string;
    invalid: string;
  };
  errors: {
    unsupportedBrowser(type: PrinterConnectionType): string;
    connectFailed: string;
    printFailed: string;
    notConnected: string;
  };
  meta: {
    title: string;
    description: string;
  };
  credit: {
    meta: {
      title: string;
      description: string;
    };
    auth: {
      title: string;
      description: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submit: string;
      submitting: string;
      invalidPassword: string;
      passwordRequired: string;
      invalidRequest: string;
      notConfigured: string;
      logout: string;
    };
    app: {
      title: string;
      subtitle: string;
    };
    form: {
      title: string;
      description: string;
      eventNameLabel: string;
      eventNamePlaceholder: string;
      newEventOption: string;
      addEventButton: string;
      eventAdded: string;
      creditLinkLabel: string;
      creditLinkPlaceholder: string;
      submit: string;
      submitting: string;
      success: string;
      notConnected: string;
      printFailed: string;
    };
    list: {
      title: string;
      description: string;
      filterLabel: string;
      filterPlaceholder: string;
      filterClear: string;
      filterStats(filtered: number, total: number): string;
      importButton: string;
      importing: string;
      clearButton: string;
      empty: string;
      noResults: string;
      statusPrinted: string;
      statusPending: string;
      importEmpty: string;
      importFailed: string;
      importSuccess(count: number): string;
      importSkipped(count: number): string;
      stats(total: number, printed: number): string;
    };
    validation: {
      eventNameRequired: string;
      eventNameTooLong: string;
      creditLinkRequired: string;
      creditLinkTooLong: string;
      creditLinkInvalid: string;
      invalid: string;
    };
    events: {
      selectLabel: string;
      selectPlaceholder: string;
      addNew: string;
    };
  };
}
