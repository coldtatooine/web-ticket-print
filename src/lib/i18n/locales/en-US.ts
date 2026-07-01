import {
  MAX_CREDIT_LINK_LENGTH,
  MAX_EVENT_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MAX_QUESTION_LENGTH,
} from "@/lib/constants";
import type { Copy } from "@/lib/i18n/types";

export const enUSCopy: Copy = {
  locale: {
    label: "Language",
    ptBR: "Português (Brasil)",
    esMX: "Español (México)",
    zhCN: "中文 (简体)",
    enUS: "English (US)",
  },
  app: {
    title: "Ask Your Question!",
    subtitle: "Write your question or comment. Join in!",
    requirementsTitle: "Before you start",
    requirements: [
      "Use Chrome or Edge (HTTPS or localhost)",
      "57/58mm thermal printer (ESC/POS)",
      "USB works directly on Linux/macOS; on Windows, use Serial with a COM port",
      "Bluetooth Classic? Pair in system settings and connect via Serial",
    ],
    dismissError: "OK, got it",
    helpButtonLabel: "View requirements before starting",
    helpClose: "Close",
    loading: "Getting things ready…",
  },
  printer: {
    title: "Printer",
    settingsButtonLabelConnected: "Configure printer — connected",
    settingsButtonLabelDisconnected: "Configure printer — disconnected",
    description: "First step: choose how to connect your 57mm printer.",
    connectedPrefix: "All set —",
    disconnect: "Switch printer",
    connecting: "Pick the printer in the browser dialog…",
    connections: [
      {
        type: "usb",
        label: "USB",
        hint: "USB cable — ideal on Linux/macOS. Windows? Use Serial.",
      },
      {
        type: "bluetooth",
        label: "Bluetooth",
        hint: "Wireless (BLE). Classic Bluetooth? Pair and use Serial.",
      },
      {
        type: "serial",
        label: "Serial",
        hint: "Serial port — paired Bluetooth or virtual COM on Windows.",
      },
    ],
  },
  form: {
    title: "Send your question",
    description: "It prints on the ticket — question, feedback, or shout-out.",
    nameLabel: "What should we call you?",
    namePlaceholder: "E.g. Ana, John…",
    questionLabel: "What do you want to ask?",
    questionPlaceholder: "Go for it — no shame.",
    submit: "Print!",
    submitting: "Hot off the press…",
    success: "Done! Your ticket printed.",
    notConnected: "Oops — connect the printer first.",
    printFailed:
      "Something went wrong with the printer (paper, cable, or power). Check and try again.",
  },
  validation: {
    nameRequired: "We need your name for the ticket.",
    nameTooLong: `Name must be at most ${MAX_NAME_LENGTH} characters.`,
    questionRequired: "Write something before printing.",
    questionTooLong: `Message must be at most ${MAX_QUESTION_LENGTH} characters.`,
    invalid: "Check the fields and try again.",
  },
  errors: {
    unsupportedBrowser(type) {
      const labels = { usb: "USB", bluetooth: "Bluetooth", serial: "Serial" };
      return `Your browser doesn't support ${labels[type]} — try Chrome or Edge.`;
    },
    connectFailed: "Couldn't connect. Try again?",
    printFailed: "Print didn't go through. Check the printer and try again.",
    notConnected: "Oops — connect the printer first.",
  },
  meta: {
    title: "Questions on paper · Cursor",
    description:
      "Send questions and comments for live thermal printing — straight from the browser.",
  },
  credit: {
    meta: {
      title: "Credit ticket · Cursor",
      description:
        "Generate credit tickets with QR codes for thermal printing at events.",
    },
    auth: {
      title: "Restricted access",
      description: "Enter the credit module password to continue.",
      passwordLabel: "Password",
      passwordPlaceholder: "Module password",
      submit: "Sign in",
      submitting: "Verifying…",
      invalidPassword: "Incorrect password.",
      passwordRequired: "Enter the password.",
      invalidRequest: "Invalid request.",
      notConfigured:
        "Module unavailable — set CREDIT_MODULE_PASSWORD in .env.",
      logout: "Sign out",
    },
    app: {
      title: "Credit ticket",
      subtitle: "Print vouchers with QR codes for credit redemption.",
    },
    form: {
      title: "Ticket details",
      description: "Event name and link appear on the printout.",
      eventNameLabel: "Event name",
      eventNamePlaceholder: "E.g. Cursor Meetup NYC",
      newEventOption: "+ New event…",
      addEventButton: "Save",
      eventAdded: "Event saved to the list.",
      creditLinkLabel: "Credit link",
      creditLinkPlaceholder: "https://…",
      submit: "Print ticket",
      submitting: "Printing…",
      success: "Credit ticket sent to the printer.",
      notConnected: "Connect the printer before printing.",
      printFailed:
        "Print failed. Check paper, cable, or power and try again.",
    },
    list: {
      title: "Ticket list",
      description:
        "Import links from CSV or XLS (one column of URLs, one per row, no header required) and click to fill the form.",
      filterLabel: "Search link",
      filterPlaceholder: "URL, code, event, or status (pending/printed)…",
      filterClear: "Clear search",
      filterStats(filtered, total) {
        return `${filtered} of ${total} link${total === 1 ? "" : "s"}`;
      },
      importButton: "Import CSV/XLS",
      importing: "Importing…",
      clearButton: "Clear list",
      empty: "No imported links. Use the button above to load a file.",
      noResults: "No links match the filter.",
      statusPrinted: "printed",
      statusPending: "pending",
      importEmpty: "No valid links found in the file.",
      importFailed: "Could not read the file. Check the format.",
      importSuccess(count) {
        return `${count} link${count === 1 ? "" : "s"} imported.`;
      },
      importSkipped(count) {
        return `${count} row${count === 1 ? "" : "s"} skipped.`;
      },
      stats(total, printed) {
        return `${total} total · ${printed} printed`;
      },
    },
    validation: {
      eventNameRequired: "Enter the event name.",
      eventNameTooLong: `Event name must be at most ${MAX_EVENT_NAME_LENGTH} characters.`,
      creditLinkRequired: "Enter the credit link.",
      creditLinkTooLong: `Link must be at most ${MAX_CREDIT_LINK_LENGTH} characters.`,
      creditLinkInvalid: "Use a valid link starting with http:// or https://.",
      invalid: "Check the fields and try again.",
    },
    events: {
      selectLabel: "Saved events",
      selectPlaceholder: "Select an event…",
      addNew: "New event (type below)",
    },
  },
};
