import {
  MAX_CREDIT_LINK_LENGTH,
  MAX_EVENT_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MAX_QUESTION_LENGTH,
} from "@/lib/constants";
import type { Copy } from "@/lib/i18n/types";

export const esMXCopy: Copy = {
  locale: {
    label: "Idioma",
    ptBR: "Português (Brasil)",
    esMX: "Español (México)",
    zhCN: "中文 (简体)",
    enUS: "English (US)",
  },
  app: {
    title: "¡Haz tu pregunta!",
    subtitle: "Escribe tu duda o comentario. ¡Participa!",
    requirementsTitle: "Antes de empezar",
    requirements: [
      "Usa Chrome o Edge (HTTPS o localhost)",
      "Impresora térmica 57/58mm (ESC/POS)",
      "USB funciona directo en Linux/macOS; en Windows, usa Serial con puerto COM",
      "¿Bluetooth Classic? Empareja en el sistema y conecta vía Serial",
    ],
    dismissError: "Ok, entendido",
    helpButtonLabel: "Ver requisitos antes de empezar",
    helpClose: "Cerrar",
    loading: "Preparando todo…",
  },
  printer: {
    title: "Impresora",
    settingsButtonLabelConnected: "Configurar impresora — conectada",
    settingsButtonLabelDisconnected: "Configurar impresora — desconectada",
    description: "Primer paso: elige cómo conectar la impresora de 57mm.",
    connectedPrefix: "Todo listo —",
    disconnect: "Cambiar impresora",
    connecting: "Elige la impresora en la ventana del navegador…",
    connections: [
      {
        type: "usb",
        label: "USB",
        hint: "Cable USB — ideal en Linux/macOS. ¿Windows? Usa Serial.",
      },
      {
        type: "bluetooth",
        label: "Bluetooth",
        hint: "Inalámbrico (BLE). ¿Bluetooth clásico? Empareja y usa Serial.",
      },
      {
        type: "serial",
        label: "Serial",
        hint: "Puerto serial — Bluetooth emparejado o COM virtual en Windows.",
      },
    ],
  },
  form: {
    title: "Envía tu pregunta",
    description: "Saldrá en el ticket — puede ser duda, feedback o elogio.",
    nameLabel: "¿Cómo te llaman?",
    namePlaceholder: "Ej.: Ana, Juan…",
    questionLabel: "¿Qué quieres preguntar?",
    questionPlaceholder: "Adelante — sin pena.",
    submit: "¡Imprimir!",
    submitting: "Saliendo del horno…",
    success: "¡Listo! Tu ticket salió de la impresora.",
    notConnected: "Ups — conecta la impresora primero.",
    printFailed:
      "Algo falló en la impresora (papel, cable o energía). Revísala e intenta de nuevo.",
  },
  validation: {
    nameRequired: "Necesitamos tu nombre para el ticket.",
    nameTooLong: `El nombre debe tener máximo ${MAX_NAME_LENGTH} caracteres.`,
    questionRequired: "Escribe algo antes de imprimir.",
    questionTooLong: `El mensaje debe tener máximo ${MAX_QUESTION_LENGTH} caracteres.`,
    invalid: "Revisa los campos e intenta de nuevo.",
  },
  errors: {
    unsupportedBrowser(type) {
      const labels = { usb: "USB", bluetooth: "Bluetooth", serial: "Serial" };
      return `Tu navegador no soporta ${labels[type]} — prueba Chrome o Edge.`;
    },
    connectFailed: "No se pudo conectar. ¿Intentas de nuevo?",
    printFailed: "La impresión no salió. Verifica la impresora e intenta otra vez.",
    notConnected: "Ups — conecta la impresora primero.",
  },
  meta: {
    title: "Preguntas en papel · Cursor",
    description:
      "Envía preguntas y comentarios para impresión térmica en vivo — directo del navegador.",
  },
  notFound: {
    meta: {
      title: "404 — Página no encontrada",
    },
    title: "Página no encontrada",
    description:
      "Esta ruta no existe. La capibara tampoco sabe a dónde querías llegar.",
    imageAlt: "Capibara mirando sin entender nada",
    homeLink: "Volver al inicio",
  },
  credit: {
    meta: {
      title: "Ticket de crédito · Cursor",
      description:
        "Genera tickets de crédito con código QR para impresión térmica en eventos.",
    },
    auth: {
      title: "Acceso restringido",
      description: "Ingresa la contraseña del módulo de crédito para continuar.",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Contraseña del módulo",
      submit: "Entrar",
      submitting: "Verificando…",
      invalidPassword: "Contraseña incorrecta.",
      passwordRequired: "Ingresa la contraseña.",
      invalidRequest: "Solicitud inválida.",
      notConfigured:
        "Módulo no disponible — configura CREDIT_MODULE_PASSWORD en .env.",
      logout: "Salir",
    },
    app: {
      title: "Ticket de crédito",
      subtitle: "Imprime vouchers con código QR para canjear crédito.",
    },
    form: {
      title: "Datos del ticket",
      description: "El nombre del evento y el enlace salen en la impresión.",
      eventNameLabel: "Nombre del evento",
      eventNamePlaceholder: "Ej.: Cursor Meetup CDMX",
      newEventOption: "+ Nuevo evento…",
      addEventButton: "Guardar",
      eventAdded: "Evento guardado en la lista.",
      creditLinkLabel: "Enlace para el crédito",
      creditLinkPlaceholder: "https://…",
      submit: "Imprimir ticket",
      submitting: "Imprimiendo…",
      success: "Ticket de crédito enviado a la impresora.",
      notConnected: "Conecta la impresora antes de imprimir.",
      printFailed:
        "Falló la impresión. Verifica papel, cable o energía e intenta de nuevo.",
    },
    list: {
      title: "Lista de tickets",
      description:
        "Importa enlaces de CSV o XLS (una columna con URLs, una por fila, sin encabezado) y haz clic para llenar el formulario.",
      filterLabel: "Buscar enlace",
      filterPlaceholder: "URL, código, evento o estado (pendiente/impreso)…",
      filterClear: "Limpiar búsqueda",
      filterStats(filtered, total) {
        return `${filtered} de ${total} enlace${total === 1 ? "" : "s"}`;
      },
      importButton: "Importar CSV/XLS",
      importing: "Importando…",
      clearButton: "Limpiar lista",
      empty: "No hay enlaces importados. Usa el botón de arriba para cargar un archivo.",
      noResults: "Ningún enlace coincide con el filtro.",
      statusPrinted: "impreso",
      statusPending: "pendiente",
      importEmpty: "No se encontraron enlaces válidos en el archivo.",
      importFailed: "No se pudo leer el archivo. Verifica el formato.",
      importSuccess(count) {
        return `${count} enlace${count === 1 ? "" : "s"} importado${count === 1 ? "" : "s"}.`;
      },
      importSkipped(count) {
        return `${count} fila${count === 1 ? "" : "s"} omitida${count === 1 ? "" : "s"}.`;
      },
      stats(total, printed) {
        return `${total} en total · ${printed} impreso${printed === 1 ? "" : "s"}`;
      },
    },
    validation: {
      eventNameRequired: "Ingresa el nombre del evento.",
      eventNameTooLong: `El nombre del evento debe tener máximo ${MAX_EVENT_NAME_LENGTH} caracteres.`,
      creditLinkRequired: "Ingresa el enlace para el crédito.",
      creditLinkTooLong: `El enlace debe tener máximo ${MAX_CREDIT_LINK_LENGTH} caracteres.`,
      creditLinkInvalid: "Usa un enlace válido que comience con http:// o https://.",
      invalid: "Revisa los campos e intenta de nuevo.",
    },
    events: {
      selectLabel: "Eventos guardados",
      selectPlaceholder: "Selecciona un evento…",
      addNew: "Nuevo evento (escribir abajo)",
    },
  },
};
